const { app } = require('@azure/functions');
const { connect, sql } = require('../db');

app.http('rackEquipment', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const pool = await connect();
        const method = request.method;
        const id = request.query.get('id');
        const rackId = request.query.get('rack_id');

        try {
            if (method === 'GET') {
                if (id) {
                    const result = await pool.request()
                        .input('id', sql.Int, id)
                        .query('SELECT * FROM dbo.RackEquipment WHERE RackEquipmentID = @id');
                    return { jsonBody: result.recordset[0] };
                } else if (rackId) {
                    const result = await pool.request()
                        .input('rack_id', sql.Int, rackId)
                        .query('SELECT * FROM dbo.RackEquipment WHERE RackID = @rack_id ORDER BY RUPosition');
                    return { jsonBody: result.recordset };
                } else {
                    const result = await pool.request().query('SELECT * FROM dbo.RackEquipment ORDER BY RackID, RUPosition');
                    return { jsonBody: result.recordset };
                }
            } else if (method === 'POST') {
                const body = await request.json();
                const result = await pool.request()
                    .input('rack_id', sql.Int, body.RackID)
                    .input('model', sql.VarChar(255), body.Model)
                    .input('brand', sql.VarChar(255), body.Brand)
                    .input('description', sql.NVarChar(sql.MAX), body.Description || null)
                    .input('image_url', sql.NVarChar(sql.MAX), body.ImageURL || null)
                    .input('ru', sql.Int, body.RU)
                    .input('depth', sql.Decimal(10, 2), body.Depth || null)
                    .input('ru_position', sql.Int, body.RUPosition)
                    .input('cost', sql.Money, body.Cost || null)
                    .input('weight', sql.Decimal(10, 2), body.Weight || null)
                    .input('is_backmounted', sql.Bit, body.Is_Backmounted ? 1 : 0)
                    .input('power_conditioner_demand', sql.Int, body.PowerConditionerDemand || null)
                    .query(`
                        INSERT INTO dbo.RackEquipment (RackID, Model, Brand, Description, ImageURL, RU, Depth, RUPosition, Cost, Weight, Is_Backmounted, PowerConditionerDemand)
                        OUTPUT INSERTED.*
                        VALUES (@rack_id, @model, @brand, @description, @image_url, @ru, @depth, @ru_position, @cost, @weight, @is_backmounted, @power_conditioner_demand)
                    `);
                return { jsonBody: result.recordset[0], status: 201 };
            } else if (method === 'PUT') {
                const body = await request.json();
                const result = await pool.request()
                    .input('id', sql.Int, body.RackEquipmentID)
                    .input('rack_id', sql.Int, body.RackID)
                    .input('model', sql.VarChar(255), body.Model)
                    .input('brand', sql.VarChar(255), body.Brand)
                    .input('description', sql.NVarChar(sql.MAX), body.Description || null)
                    .input('image_url', sql.NVarChar(sql.MAX), body.ImageURL || null)
                    .input('ru', sql.Int, body.RU)
                    .input('depth', sql.Decimal(10, 2), body.Depth || null)
                    .input('ru_position', sql.Int, body.RUPosition)
                    .input('cost', sql.Money, body.Cost || null)
                    .input('weight', sql.Decimal(10, 2), body.Weight || null)
                    .input('is_backmounted', sql.Bit, body.Is_Backmounted ? 1 : 0)
                    .input('power_conditioner_demand', sql.Int, body.PowerConditionerDemand || null)
                    .query(`
                        UPDATE dbo.RackEquipment
                        SET RackID = @rack_id, Model = @model, Brand = @brand, Description = @description,
                            ImageURL = @image_url, RU = @ru, Depth = @depth, RUPosition = @ru_position,
                            Cost = @cost, Weight = @weight, Is_Backmounted = @is_backmounted,
                            PowerConditionerDemand = @power_conditioner_demand
                        WHERE RackEquipmentID = @id;
                        SELECT * FROM dbo.RackEquipment WHERE RackEquipmentID = @id
                    `);
                return { jsonBody: result.recordset[0] };
            } else if (method === 'DELETE') {
                const idToDelete = id || (await request.json()).id;
                await pool.request()
                    .input('id', sql.Int, idToDelete)
                    .query('DELETE FROM dbo.RackEquipment WHERE RackEquipmentID = @id');
                return { status: 204 };
            }
        } catch (err) {
            context.error(err);
            return { status: 500, body: err.message };
        }
    }
});