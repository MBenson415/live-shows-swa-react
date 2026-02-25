const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('bands', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const pool = await connect();
        const method = request.method;
        const id = request.query.get('id');
        const all = request.query.get('all');

        try {
            if (method === 'GET') {
                if (id) {
                    const result = await pool.request()
                        .input('id', sql.Int, id)
                        .query('SELECT * FROM dbo.BANDS WHERE ID = @id');
                    return { jsonBody: result.recordset[0] };
                } else if (all) {
                    const result = await pool.request().query('SELECT * FROM dbo.BANDS');
                    return { jsonBody: result.recordset };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.BANDS WHERE Display_On_Site = 1');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('name', sql.VarChar, body.name)
                    .input('logo', sql.NVarChar, body.logo_image_link)
                    .input('is_active', sql.Bit, body.is_active !== undefined ? body.is_active : 1)
                    .input('start_date', sql.Date, body.start_date || null)
                    .input('end_date', sql.Date, body.end_date || null)
                    .input('location', sql.VarChar(255), body.location || null)
                    .input('band_image', sql.NVarChar, body.band_image || null)
                    .input('description', sql.NVarChar, body.description || null)
                    .input('url', sql.NVarChar, body.url || null)
                    .input('display_on_site', sql.Bit, body.display_on_site !== undefined ? body.display_on_site : 1)
                    .query('INSERT INTO dbo.BANDS (NAME, LOGO_IMAGE_LINK, IS_ACTIVE, START_DATE, END_DATE, LOCATION, BAND_IMAGE, DESCRIPTION, URL, Display_On_Site) OUTPUT INSERTED.* VALUES (@name, @logo, @is_active, @start_date, @end_date, @location, @band_image, @description, @url, @display_on_site)');
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.id)
                    .input('name', sql.VarChar, body.name)
                    .input('logo', sql.NVarChar, body.logo_image_link)
                    .input('is_active', sql.Bit, body.is_active !== undefined ? body.is_active : 1)
                    .input('start_date', sql.Date, body.start_date || null)
                    .input('end_date', sql.Date, body.end_date || null)
                    .input('location', sql.VarChar(255), body.location || null)
                    .input('band_image', sql.NVarChar, body.band_image || null)
                    .input('description', sql.NVarChar, body.description || null)
                    .input('url', sql.NVarChar, body.url || null)
                    .input('display_on_site', sql.Bit, body.display_on_site !== undefined ? body.display_on_site : 1)
                    .query('UPDATE dbo.BANDS SET NAME = @name, LOGO_IMAGE_LINK = @logo, IS_ACTIVE = @is_active, START_DATE = @start_date, END_DATE = @end_date, LOCATION = @location, BAND_IMAGE = @band_image, DESCRIPTION = @description, URL = @url, Display_On_Site = @display_on_site WHERE ID = @id; SELECT * FROM dbo.BANDS WHERE ID = @id');
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
