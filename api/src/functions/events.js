const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('events', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const pool = await connect();
        const method = request.method;
        const id = request.query.get('id');
        const venueId = request.query.get('venue_id');

        try {
            if (method === 'GET') {
                if (id) {
                    const result = await pool.request()
                        .input('id', sql.Int, id)
                        .query('SELECT * FROM dbo.EVENTS WHERE ID = @id');
                    return { jsonBody: result.recordset[0] };
                } else if (venueId) {
                    const result = await pool.request()
                        .input('venue_id', sql.Int, venueId)
                        .query('SELECT * FROM dbo.EVENTS WHERE VENUE_ID = @venue_id ORDER BY DATE DESC');
                    return { jsonBody: result.recordset };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.EVENTS ORDER BY DATE DESC');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('band_id', sql.Int, body.band_id)
                    .input('venue_id', sql.Int, body.venue_id)
                    .input('date', sql.DateTime2, body.date)
                    .input('ticket_link', sql.VarChar, body.ticket_link)
                    .input('facebook_link', sql.VarChar, body.facebook_link)
                    .input('promo', sql.NVarChar, body.promo)
                    .input('name', sql.NVarChar, body.name)
                    .query(`
                        INSERT INTO dbo.EVENTS (BAND_ID, VENUE_ID, DATE, TICKET_LINK, FACEBOOK_LINK, PROMO, NAME)
                        OUTPUT INSERTED.*
                        VALUES (@band_id, @venue_id, @date, @ticket_link, @facebook_link, @promo, @name)
                    `);
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.id)
                    .input('band_id', sql.Int, body.band_id)
                    .input('venue_id', sql.Int, body.venue_id)
                    .input('date', sql.DateTime2, body.date)
                    .input('ticket_link', sql.VarChar, body.ticket_link)
                    .input('facebook_link', sql.VarChar, body.facebook_link)
                    .input('promo', sql.NVarChar, body.promo)
                    .input('name', sql.NVarChar, body.name)
                    .query(`
                        UPDATE dbo.EVENTS
                        SET BAND_ID = @band_id, VENUE_ID = @venue_id, DATE = @date,
                            TICKET_LINK = @ticket_link, FACEBOOK_LINK = @facebook_link,
                            PROMO = @promo, NAME = @name
                        WHERE ID = @id;
                        SELECT * FROM dbo.EVENTS WHERE ID = @id
                    `);
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.EVENTS WHERE ID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});
