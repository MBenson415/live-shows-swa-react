const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('bands', {
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
                        .query('SELECT * FROM dbo.BANDS WHERE ID = @id');
                    return { jsonBody: result.recordset[0] };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.BANDS');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('name', sql.VarChar, body.name)
                    .input('logo', sql.NVarChar, body.logo_image_link)
                    .query('INSERT INTO dbo.BANDS (NAME, LOGO_IMAGE_LINK) OUTPUT INSERTED.* VALUES (@name, @logo)');
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.id)
                    .input('name', sql.VarChar, body.name)
                    .input('logo', sql.NVarChar, body.logo_image_link)
                    .query('UPDATE dbo.BANDS SET NAME = @name, LOGO_IMAGE_LINK = @logo WHERE ID = @id; SELECT * FROM dbo.BANDS WHERE ID = @id');
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.BANDS WHERE ID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});
