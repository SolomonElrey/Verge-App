const moment = require("moment");
const queries = require('./query');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function createNewUser(body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const type = "user"
    const { email,
        password,
        first_name,
        last_name,
        state
    } = body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    try {
        const queryObject = {
            text: queries.addNewUser,
            values: [email, hashedPassword, first_name, last_name, state, type, created_at, created_at],
        };
        console.log('check Me')
        const { rowCount } = await db.query(queryObject);
        console.log('check')
        if (rowCount == 0) {
            return Promise.reject({
                status: 'error',
                code: 400,
                message: 'Could not create User',
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: 'success',
                code: 200,
                message: 'user created successfully',
            });
        }

    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: 'error',
            code: 500,
            message: 'Error creating user',
        });
    }

}
async function checkIfUserDoesNotExistBefore(email) {
    const queryObject = {
        text: queries.findBlogByEmail,
        values: [email],
    };
    console.log(email);
    console.log(queries.findBlogByEmail);
    try {
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
            return Promise.reject({
                status: 'error',
                code: 400,
                message: 'User Already Exists'
            }); ''
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: 'error',
            code: 500,
            message: 'Error finding User',
        });
    }
}

async function createUserLogin(body) {
    const { email, password } = body
    const queryObject = {
        text: queries.findUserByEmail,
        values: [email],
    };

    try {
        const { rows } = await db.query(queryObject);
        const validPass = await bcrypt.compareSync(password, rows[0].password);
        if (!validPass) return Promise.reject({
            status: 'error',
            code: 400,
            message: 'password does not match',
        });
        return Promise.resolve({
            status: 'success',
            code: 200,
            message: 'successfully logged in',
            user: rows,
        });


    } catch (e) {
        return Promise.reject({
            status: 'error',
            code: 500,
            message: 'Error logging in',
        });
    }
}

async function authenticateByToken(req, res, next) {
    const { auth } = req.headers;
    const token = auth;
    if (!token) {
        return res.status(401).json({
            status: "forbidden",
            code: 401,
            message: "Access Denied",
        })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user)
    } catch (e) {
        console.log(e);
        return res.status(401).json({
            status: "error",
            code: 400,
            message: "Invalid Token",
        });
    }

    next()
}

async function createNewOrder(body,user_id) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { 
        price,
        weight,
        location,
        destination,
        sender_name,
        sender_note
    } = body;
    const queryObject = {
        text: queries.createNewParcelDeliveryOrder,
        values: [user_id, price, weight, location, destination, sender_name, sender_note, created_at, created_at],
    };

    try {
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            console.log('status')
            return Promise.reject({
                status: 'error',
                code: 400,
                message: 'Could not place Order',
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: 'success',
                code: 201,
                message: 'Order placed successfully',
            });
        }


    } catch (e) {
        return Promise.reject({
            status: 'error',
            code: 500,
            message: 'Error placing parcel order',
        });
    }
}

async function updateParcelById(id, body) {
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { destination } = body;
    const queryObject = {
        text: queries.updateParcelById,
        values: [destination, updated_at, id],
    };
    try {
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 400,
                message: "Parcel with id not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel updated successfully",
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating Order",
        });
    }
}

async function updateParcelByStatusId(id, body) {
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { status } = body;
    const queryObject = {
        text: queries.updateParcelByStatusId,
        values: [status, updated_at, id],
    };
    try {
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 400,
                message: "Parcel with id not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel updated successfully",
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating Order",
        });
    }
}


async function updateParcelByLocationId(id, body) {
    const d = new Date();
    const updated_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const { location } = body;
    const queryObject = {
        text: queries.updateParcelByLocationId,
        values: [location, updated_at, id],
    };
    try {
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 400,
                message: "Parcel with id not found",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Parcel updated successfully",
            });
        }
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating Order",
        });
    }
}

async function getOrder(id) {
    const queryObject = {
        text: queries.findOrderById,
        values: [id],
    };
    try {
        const { rows } = await db.query(queryObject);
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetch Order",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching Order",
        });
    }
}

async function getMyOrder(user_id) {
    const queryObject = {
        text: queries.findOrderByUserId,
        values: [user_id],
    };
    try {
        const { rows } = await db.query(queryObject);
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetch Order",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching Order",
        });
    }
}

async function getAllOrder() {
    const queryObject = {
        text: queries.findAllOrder,
    };
    try {
        const { rows } = await db.query(queryObject);
        return Promise.resolve({
            status: "success",
            code: 200,
            message: "Successfully fetch all order",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching all order",
        });
    }
}

async function createNewAdmin(body) {
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");
    const type = "superAdmin"
    const { email,
        password,
        first_name,
        last_name,
        state
    } = body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt)
    try {
        const queryObject = {
            text: queries.addNewUser,
            values: [email, hashedPassword, first_name, last_name, state, type, created_at, created_at],
        };
        const { rowCount } = await db.query(queryObject);
        if (rowCount == 0) {
            return Promise.reject({
                status: 'error',
                code: 500,
                message: 'Could not create User',
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: 'success',
                code: 200,
                message: 'user created successfully',
            });
        }

    } catch (e) {
        return Promise.reject({
            status: 'error',
            code: 500,
            message: 'Error creating user',
        });
    }

}


module.exports = {
    createNewUser, checkIfUserDoesNotExistBefore,
    createUserLogin, authenticateByToken,createNewOrder,
    updateParcelById,updateParcelByStatusId, updateParcelByLocationId, getOrder, getMyOrder,
    getAllOrder, createNewAdmin,
};