const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('venues', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const pool = await connect();
        const method = request.method;
        const id = request.query.get('id');

        try {
            if (method === 'GET') {
                if (id) {
                    const result = await pool.request()
                        .input('id', sql.Int, id)
                        .query('SELECT * FROM dbo.VENUE WHERE ID = @id');
                    return { jsonBody: result.recordset[0] };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.VENUE');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('name', sql.VarChar, body.name)
                    .input('state', sql.VarChar, body.state)
                    .input('zip', sql.VarChar, body.zip)
                    .input('country', sql.VarChar, body.country)
                    .input('city', sql.NVarChar, body.city)
                    .input('street', sql.NVarChar, body.street)
                    .input('google_maps_link', sql.NVarChar, body.google_maps_link)
                    .input('address', sql.NVarChar, body.address)
                    .query(`
                        INSERT INTO dbo.VENUE (NAME, STATE, ZIP, COUNTRY, CITY, STREET, GOOGLE_MAPS_LINK, ADDRESS)
                        OUTPUT INSERTED.*
                        VALUES (@name, @state, @zip, @country, @city, @street, @google_maps_link, @address)
                    `);
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.id)
                    .input('name', sql.VarChar, body.name)
                    .input('state', sql.VarChar, body.state)
                    .input('zip', sql.VarChar, body.zip)
                    .input('country', sql.VarChar, body.country)
                    .input('city', sql.NVarChar, body.city)
                    .input('street', sql.NVarChar, body.street)
                    .input('google_maps_link', sql.NVarChar, body.google_maps_link)
                    .input('address', sql.NVarChar, body.address)
                    .query(`
                        UPDATE dbo.VENUE
                        SET NAME = @name, STATE = @state, ZIP = @zip, COUNTRY = @country,
                            CITY = @city, STREET = @street, GOOGLE_MAPS_LINK = @google_maps_link,
                            ADDRESS = @address
                        WHERE ID = @id;
                        SELECT * FROM dbo.VENUE WHERE ID = @id
                    `);
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.VENUE WHERE ID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});
