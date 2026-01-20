const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('racks', {
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
                        .query('SELECT * FROM dbo.Racks WHERE RackID = @id');
                    return { jsonBody: result.recordset[0] };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.Racks ORDER BY RackName');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('rack_name', sql.VarChar(255), body.RackName)
                    .input('ru_capacity', sql.Int, body.RUCapacity)
                    .input('rack_model', sql.VarChar(255), body.RackModel || null)
                    .input('rack_brand', sql.VarChar(255), body.RackBrand || null)
                    .input('rack_description', sql.NVarChar(sql.MAX), body.RackDescription || null)
                    .input('rack_image_url', sql.NVarChar(sql.MAX), body.RackImageURL || null)
                    .input('rack_depth', sql.Decimal(10, 2), body.RackDepth || null)
                    .input('rack_cost', sql.Money, body.RackCost || null)
                    .input('rack_weight', sql.Decimal(10, 2), body.RackWeight || null)
                    .input('power_conditioner_capacity', sql.Int, body.PowerConditionerCapacity || null)
                    .query(`
                        INSERT INTO dbo.Racks (RackName, RUCapacity, RackModel, RackBrand, RackDescription, RackImageURL, RackDepth, RackCost, RackWeight, PowerConditionerCapacity)
                        OUTPUT INSERTED.*
                        VALUES (@rack_name, @ru_capacity, @rack_model, @rack_brand, @rack_description, @rack_image_url, @rack_depth, @rack_cost, @rack_weight, @power_conditioner_capacity)
                    `);
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.RackID)
                    .input('rack_name', sql.VarChar(255), body.RackName)
                    .input('ru_capacity', sql.Int, body.RUCapacity)
                    .input('rack_model', sql.VarChar(255), body.RackModel || null)
                    .input('rack_brand', sql.VarChar(255), body.RackBrand || null)
                    .input('rack_description', sql.NVarChar(sql.MAX), body.RackDescription || null)
                    .input('rack_image_url', sql.NVarChar(sql.MAX), body.RackImageURL || null)
                    .input('rack_depth', sql.Decimal(10, 2), body.RackDepth || null)
                    .input('rack_cost', sql.Money, body.RackCost || null)
                    .input('rack_weight', sql.Decimal(10, 2), body.RackWeight || null)
                    .input('power_conditioner_capacity', sql.Int, body.PowerConditionerCapacity || null)
                    .query(`
                        UPDATE dbo.Racks
                        SET RackName = @rack_name, RUCapacity = @ru_capacity, RackModel = @rack_model,
                            RackBrand = @rack_brand, RackDescription = @rack_description,
                            RackImageURL = @rack_image_url, RackDepth = @rack_depth,
                            RackCost = @rack_cost, RackWeight = @rack_weight,
                            PowerConditionerCapacity = @power_conditioner_capacity
                        WHERE RackID = @id;
                        SELECT * FROM dbo.Racks WHERE RackID = @id
                    `);
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.RackEquipment WHERE RackID = @id; DELETE FROM dbo.Racks WHERE RackID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});