import * as http from 'http';
import * as express from 'express';
import * as mysql from 'mysql';
import * as moment from 'moment';
import * as compression from 'compression';

const createDbConnection = () => mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'gastos',
    multipleStatements: true
});

const app = express();
const apiRouter = express.Router();

apiRouter.get('/gastos', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select * from gastos', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});


apiRouter.post('/gastos', (req, res, next) => {
    const gasto = req.body;

    const conn = createDbConnection();
    conn.connect();

    conn.query(`insert into gastos (
            fecha, idCuenta, idCategoria, esEspecial, importe, idPersona, descripcion
        ) values (?, ?, ?, ?; ?, ?, ?)`,
        [gasto.fecha, gasto.idCuenta, gasto.idCategoria, gasto.esEspecial, gasto.importe, gasto.idPersona, gasto.descripcion],
         (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/mensualidades', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query(`
        select fechaMensualidad, importeMensual, importeTotal, periodoPago, descripcion, cantidadPagos
        from mensualidadesPendientesSinIntereses`, (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/gastos-diarios', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select * from gastos', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }


        const gastos = results;


        const gastosDias = [];
        gastos.forEach(g => {
            const dia = moment(g.Fecha);

            if (!gastosDias.includes(dia.format('YYYY-MM-DD'))) {
                gastosDias.push(dia.format('YYYY-MM-DD'));
            } else {
            }

            g.Fecha = moment(g.Fecha);
        });

        let gastosDiarios = gastosDias.map(gd => {
            const fecha = moment(gd).startOf('day');
            const resumen = {
                fecha: fecha,
                gastos: gastos.filter(g => fecha.isSame(g.Fecha, 'day'))
                .sort((a, b) => (a.Fecha as moment.Moment).diff(b.Fecha)),
                total: 0
            };

            resumen.total = resumen.gastos.reduce((a, b) => a + b.Importe, 0);
            return resumen;
        });

        gastosDiarios = gastosDiarios.sort((a, b) => -moment(a.fecha).diff(b.fecha));
        res.send(gastosDiarios);
    });

    conn.end();
});

apiRouter.get('/saldos', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select * from saldosActuales', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/categorias', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select idCategoria, nombre from categorias', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/cuentas', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select idCuentas, nombre from cuentas', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/personas', (req, res, next) => {
    const conn = createDbConnection();
    conn.connect();

    conn.query('select idPersona, nombre from personas', (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        res.send(results);
    });

    conn.end();
});

apiRouter.get('/pronostico', (req, res, next) => {
    let fechaInicio = req.query.fechaInicio ? moment(req.query.fechaInicio) : moment() ;
    let fechaFin = req.query.fechaFin ? moment(req.query.fechaFin) : moment() ;

    fechaInicio = fechaInicio.startOf('day');
    fechaFin = fechaFin.startOf('day');

    if (fechaFin.isBefore(fechaInicio)) {
        res.status(400).send('La fecha de fin no puede ser anterior a la de inicio');
        return;
    }

    const conn = createDbConnection();
    conn.connect();

    conn.query(`
    select sum(sa.saldo - sa.gastos) as saldo, c.idCuenta
    from saldosActuales sa
        inner join cuentas c on sa.idCuenta = c.idCuenta
    where c.idTipoCuenta = 1;

    select dia, gastosNoEspeciales
    from promediosDiasSemana;

    select fechaMensualidad, importeMensual, idTarjetaCredito
    from mensualidadesPendientesSinIntereses;

    select fecha, importe, concepto, idCuenta
    from movimientosUnicos;

    select tc.idTarjetaCredito, saldo + gastos as saldo, tc.fechaCorte,
        tc.tasaInteres, c.nombre, tc.limiteCredito, tc.idCuentaPrincipal
    from saldosActuales sa
        join tarjetasCredito tc on tc.idTarjetaCredito = sa.idCuenta
        join cuentas c on tc.idTarjetaCredito = c.idCuenta
    where c.idTipoCuenta = 2;

    select saldo as saldo
    from saldosActuales
    where idCuenta in (4);

    select idCuenta, idPeriodicidad, dia, mes, enFinDeMes, fechaInicio, fechaFin, importe, descripcion
    from movimientosRecurrentes;
    `, (err, results, fields) => {
        if (err) {
            console.log(err);
            throw err;
        }

        const saldos: Array<any> = results[0];
        const promediosDia: Array<any> = results[1];
        const mensualidades: Array<any> = results[2];
        const movimientosUnicos: Array<any> = results[3];
        const tarjetas: Array<any> = results[4];
        const ahorroInicial = results[5][0].saldo;
        const movimientosRecurrentes = results[6];

        let dias: Array<{
            fecha?: moment.Moment,
            saldo?: number,
            sueldo?: number,
            percepciones?: {
                total: number,
                detalle: Array<{
                    descripcion: string,
                    importe: number
                    }>
            },
            ahorro?: number,
            aportacionAhorro?: number,
            ahorroFinal?: number,
            gastos?: number,
            hipoteca?: number,
            disponibleDeudas?: number,
            tarjetas?: {[key: string]: {
                saldo?: number,
                minimo?: number,
                intereses?: number,
                mensualidades?: number,
                totalPagar?: number,
                disponiblePago?: number,
                pago?: number,
                saldoFinal?: number
            }}
            saldoFinal?: number,
        }> = [];

        for (let i = 0; ; i++) {
            const dia: {
                fecha?: moment.Moment,
                saldo?: number,
                sueldo?: number,
                percepciones?: {
                    total: number,
                    detalle: Array<{
                        descripcion: string,
                        importe: number
                        }>
                },
                ahorro?: number,
                aportacionAhorro?: number,
                ahorroFinal?: number,
                gastos?: number,
                hipoteca?: number,
                disponibleDeudas?: number,
                tarjetas?: {[key: string]: {
                    saldo?: number,
                    minimo?: number,
                    intereses?: number,
                    mensualidades?: number,
                    totalPagar?: number,
                    disponiblePago?: number,
                    pago?: number,
                    saldoFinal?: number
                }}
                saldoFinal?: number,
            } = {};


            const cuentas = saldos;
            // cuentas.forEach(cuenta => {
                // const saldoInicial = cuenta.saldo;
                const saldoInicial = cuentas.reduce((a, b) => a + b.saldo, 0);
                // const tarjetasCuenta = tarjetas.filter(dt => dt.idCuentaPrincipal === cuenta.idCuenta);
                const tarjetasCuenta = tarjetas;
                // const movimientosUnicosCuenta = movimientosUnicos.filter(mu => mu.idCuenta === cuenta.idCuenta);
                const movimientosUnicosCuenta = movimientosUnicos;
                // const movimientosRecurrentesCuenta = movimientosRecurrentes.filter(mu => mu.idCuenta === cuenta.idCuenta);
                const movimientosRecurrentesCuenta = movimientosRecurrentes;


                if (i === 0) {
                    dia.fecha = moment();
                    dia.saldo = saldoInicial;
                    dia.ahorro = ahorroInicial;
                    dia.tarjetas = {};
                    tarjetasCuenta.forEach(t => dia.tarjetas[t.nombre] = {
                        saldo: t.saldo
                    }); // datosLight.saldo;
                } else {
                    dia.fecha = moment(dias[i - 1].fecha).add(1, 'day');
                    dia.saldo = dias[i - 1].saldoFinal;
                    dia.ahorro = dias[i - 1].ahorroFinal * (1 + (4 / 100 / 365));
    
                    dia.tarjetas = {};
                    tarjetasCuenta.forEach(t => dia.tarjetas[t.nombre] = {
                        saldo: dias[i - 1].tarjetas[t.nombre].saldoFinal
                    });
                }
                dia.percepciones = {
                    total: 0,
                    detalle: []
                };
    
                // movimientos unicos
                dia.percepciones.detalle = dia.percepciones.detalle.concat(
                    movimientosUnicosCuenta.filter(m => dia.fecha.isSame(m.fecha, 'day')).map(m => ({
                        descripcion: m.concepto,
                        importe: m.importe
                    }))
                );
                // = .reduce((a, b) => a + b.importe, 0);
                // movimientos recurrentes
                dia.percepciones.detalle = dia.percepciones.detalle.concat(
                    movimientosRecurrentesCuenta.filter(m => {
                        if (dia.fecha.isSameOrAfter(m.fechaInicio)  &&  (!m.fechaFin  ||  dia.fecha.isSameOrBefore(m.fechaFin))) {
                            switch (m.idPeriodicidad) {
                                case 1: // Mensual
                                    return (m.dia === dia.fecha.date()  ||  (m.enFinDeMes as Buffer).readInt8(0)  &&  dia.fecha.date() === dia.fecha.daysInMonth());
                                case 2: // Anual
                                    return (m.dia === dia.fecha.date()  ||  (m.enFinDeMes as Buffer).readInt8(0)  &&  dia.fecha.date() === dia.fecha.daysInMonth())
                                        &&  m.mes === dia.fecha.month();
                                default:
                                    throw new Error(`Periodicidad no implementada: ${m.idPeriodicidad}`);
                            }
                        } else {
                            return false;
                        }
                    }).map(m => ({
                        descripcion: m.descripcion,
                        importe: m.importe
                    }))
                );
    
                dia.percepciones.total = dia.percepciones.detalle.reduce((a, b) => a + b.importe, 0);
                dia.aportacionAhorro = dia.percepciones.total * 0.1;
                // dia.aportacionAhorro = Math.max(Math.min(20000 - dia.ahorro, dia.percepciones.total * 0.1), 0);
                dia.ahorroFinal = dia.ahorro + dia.aportacionAhorro;
    
                dia.gastos = promediosDia.find(p => dia.fecha.isoWeekday() === p.dia).gastosNoEspeciales;
                dia.hipoteca = dia.fecha.date() === 3 ? 9800 : 0;
    
                dia.disponibleDeudas = Math.max(
                    dia.saldo + dia.percepciones.total
                        - (dia.aportacionAhorro + 9800 + (promediosDia.reduce(
                            (a, b) => a + b.gastosNoEspeciales, 0) / promediosDia.length) * 30),
                    0);
    
                // operaciones de tarjetas de credito
                tarjetasCuenta.forEach(t => {
                    // suma de intereses
                    if (dia.fecha.date() === t.fechaCorte) {
                        dia.tarjetas[t.nombre].intereses = dia.tarjetas[t.nombre].saldo * (t.tasaInteres / 12 / 100);
                        // dia.interesesLight = dia.saldoLight * (datosLight.tasaInteres / 12 / 100);
                    } else {
                        dia.tarjetas[t.nombre].intereses = 0;
                        // dia.interesesLight = 0;
                    }
    
                    // suma de mensualidades
                    if ( moment(dia.fecha).subtract(20, 'days').set('D', t.fechaCorte).add(20, 'days').isSame(dia.fecha)) {
                        dia.tarjetas[t.nombre].mensualidades = mensualidades
                            .filter(m => dia.fecha.isSame(m.fechaMensualidad, 'day') && m.idTarjetaCredito === t.idTarjetaCredito)
                            .reduce((a, b) => a + b.importeMensual, 0);
                        dia.tarjetas[t.nombre].minimo = Math.min(dia.tarjetas[t.nombre].saldo, t.limiteCredito * 1.25 / 100);
                        dia.tarjetas[t.nombre].disponiblePago = (dia.disponibleDeudas * dia.tarjetas[t.nombre].saldo /
                            Object.keys(dia.tarjetas).reduce((a, b) => a + dia.tarjetas[b].saldo, 0)) || 0;
                    } else {
                        dia.tarjetas[t.nombre].mensualidades = 0;
                        dia.tarjetas[t.nombre].minimo = 0;
                        dia.tarjetas[t.nombre].disponiblePago = 0;
                    }
    
                    dia.tarjetas[t.nombre].totalPagar = Math.min(
                        dia.tarjetas[t.nombre].saldo + dia.tarjetas[t.nombre].mensualidades,
                        Math.max(dia.tarjetas[t.nombre].disponiblePago, dia.tarjetas[t.nombre].minimo + dia.tarjetas[t.nombre].mensualidades));
                    dia.tarjetas[t.nombre].saldoFinal =
                        dia.tarjetas[t.nombre].saldo + dia.tarjetas[t.nombre].intereses +
                        dia.tarjetas[t.nombre].mensualidades - dia.tarjetas[t.nombre].totalPagar;
                });
    
    
                dia.saldoFinal = +(dia.saldo + dia.percepciones.total - dia.aportacionAhorro
                    - dia.gastos - dia.hipoteca - Object.keys(dia.tarjetas).reduce((a, b) => a + dia.tarjetas[b].totalPagar, 0)).toFixed(2);
                dias.push(dia);
                if (dia.fecha.isSame(fechaFin, 'day')) {
                    break;
                }
            }
    
            dias = dias.filter(d => d.fecha.isSameOrAfter(fechaInicio, 'day'));
        // });
        
        // res.send(cuentas);
        res.send(dias);
    });

    conn.end();
});

app.use(compression());
app.use('/api', apiRouter);
app.use(express.static(__dirname), (err, req, res, next) => {
    res.send('hola');
});
app.get('*', (req, res, next) => {
    res.sendFile(__dirname + '/index.html');
});


const port = process.env.PORT || '8123';
app.set('port', port);


const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
