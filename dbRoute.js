const express = require('express');
const router = express.Router();
const schema = require('./validation');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()


const
    { createNewUser, checkIfUserDoesNotExistBefore,
        createUserLogin,authenticateByToken, createNewOrder,
        updateParcelById,updateParcelByStatusId, updateParcelByLocationId, getOrder, getMyOrder,
        getAllOrder, createNewAdmin,
    } = require('./vergeService')

router.post('/auth/signup', async (req, res, next) => {

    try {
        const value = await schema.user.validate(req.body)
        if (value.error) {
            return res.status(400).json({
                message: value.error.details[0].message
            })
        }
    } catch (e) {
        console.log(e)
    }

    next();
}, async (req, res) => {
    const { email } = req.body;
    try {
        await checkIfUserDoesNotExistBefore(email);
        const result = await createNewUser(req.body);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}
);

router.post('/auth/login', async (req, res, next) => {
    try {
        const value = await schema.login.validate(req.body)
        if (value.error) {
            return res.status(400).json({
                message: value.error.details[0].message
            })
        }
    } catch (e) {
        console.log(e)
    }
    next();
}, async (req, res) => {

    try {
        const result = await createUserLogin(req.body);
        const token = jwt.sign({id: result.user[0].id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).json({...result, data: {token}});
        
    } catch (e) {
        return res.status(e.code).json(e);
    }
}
);


router.post("/auth/parcel",authenticateByToken, async (req, res, next) => {
    try {
        const value = await schema.parcel.validate(req.body)
        if (value.error) {
            return res.status(400).json({
                message: value.error.details[0].message
            })
        }
    } catch (e) {
        console.log(e)
    }

    next();
},
    async (req, res) => {
        try {
            const result = await createNewOrder(req.body, req.user.id);
            return res.status(201).json(result);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
);

router.put("/auth/parcel/destination/change/:id",authenticateByToken, async (req, res, next) => {
    const { id } = req.params;
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    next();
},
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await updateParcelById(id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.put("/auth/parcel/status/change/:id",authenticateByToken, async (req, res, next) => {
    const { id } = req.params;
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    next();
},
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await updateParcelByStatusId(id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.put("/auth/parcel/location/change/:id", authenticateByToken, async (req, res, next) => {
    const { id } = req.params;
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    next();
},
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await updateParcelByLocationId(id, req.body);
            return res.status(200).json(result);
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
);

router.get("/parcel/:id",authenticateByToken, async (req, res, next) => {
    const { id } = req.params;
    if (!parseInt(id)) {
        return res.status(400).json({
            message: "Id must be an integer",
        });
    }
    next();
}, async (req, res) => {
    try {
        const {id} = req.params;
        const result = await getOrder(id);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);

    }
});

router.get("/parcel/all", authenticateByToken, async (req, res) => {
    try {
        const result = await getAllOrder();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
});

router.get("/parcel",authenticateByToken, async (req, res) => {
    try {
        console.log("where")
        console.log(req.user.id)
        const result = await getMyOrder(req.user.id);
        console.log('where exactly')
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
});

router.post('/auth/admin/signup', async (req, res, next) => {
    try {
        const value = await schema.user.validate(req.body)
        if (value.error) {
            return res.status(400).json({
                message: value.error.details[0].message
            })
        }
    } catch (e) {
        console.log(e)
    }
    next();
}, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await createNewAdmin(req.body);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(e.code).json(e);
    }
}
);



module.exports = router