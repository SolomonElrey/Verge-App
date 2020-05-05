const queries = {
  addNewUser: `
    INSERT INTO users (
      email,
      password,
      first_name,
      last_name,
      state,
      type, 
      created_at,
      updated_at
      )VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
  findUserByEmail: `
    SELECT * FROM users WHERE email= ($1)
    `,
  findBlogByEmail: `
    SELECT * FROM users WHERE email= ($1)
    `,
  createNewParcelDeliveryOrder: `
    INSERT INTO parcel (
    user_id,
    price, 
    weight,
    location, 
    destination,
    sender_name,
    sender_note,
    created_at,
    updated_at   
    )VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
     `,
  updateParcelById: `
     UPDATE parcel SET destination=($1), updated_at=($2)  WHERE id=($3)
   `,
  updateParcelByLocationId: `
   UPDATE parcel SET location=($1), updated_at=($2)  WHERE id=($3)
 `,
  updateParcelByStatusId: `
 UPDATE parcel SET status=($1), updated_at=($2)  WHERE id=($3)
`,
  findOrderById: `
      SELECT * FROM parcel WHERE id=($1)
    `,
  findOrderByUserId: `
      SELECT * FROM parcel WHERE user_id=($1)
    `,
  findAllOrder: `
    SELECT * FROM parcel 
    `,
  checkAdminStatus: `
    SELECT * FROM users WHERE id=($1) 
    `,

};

module.exports = queries;


// createNewParcelDeliveryOrder:`
//         INSERT INTO parcel (
//             price, 
//             weight,
//             location, 
//             destination,
//             sender_name,
//             sender_note  
//         )VALUES($1, $2, $3, $4, $5, $6) RETURNING *
//     `,
//     updateParcelOrderByDestination:`
//     UPDATE parcel SET price=($1), weight=($2), location=($3), sender_name=($5), sender_note =($6) WHERE destination=($4)
//     `,
//     cancelParcelDeliveryOrder:`
//     DELETE FROM parcel WHERE id=($1)
//     `,
//     findAllParcel:`
//     SELECT * FROM parcel
//     `,
