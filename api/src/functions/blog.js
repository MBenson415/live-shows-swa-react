const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('blog', {
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
                        .query('SELECT * FROM dbo.BlogPosts WHERE PostID = @id');
                    return { jsonBody: result.recordset[0] };
                } else {
                    const result = await pool.request()
                        .query('SELECT * FROM dbo.BlogPosts ORDER BY CreatedAt DESC');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('title', sql.VarChar(255), body.title)
                    .input('body', sql.NVarChar(sql.MAX), body.body)
                    .input('author', sql.VarChar(100), body.author)
                    .query(`
                        INSERT INTO dbo.BlogPosts (Title, Body, Author, CreatedAt)
                        OUTPUT INSERTED.*
                        VALUES (@title, @body, @author, GETDATE())
                    `);
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.id)
                    .input('title', sql.VarChar(255), body.title)
                    .input('body', sql.NVarChar(sql.MAX), body.body)
                    .input('author', sql.VarChar(100), body.author)
                    .query(`
                        UPDATE dbo.BlogPosts
                        SET Title = @title, Body = @body, Author = @author, UpdatedAt = GETDATE()
                        WHERE PostID = @id;
                        SELECT * FROM dbo.BlogPosts WHERE PostID = @id
                    `);
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.BlogPosts WHERE PostID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});
