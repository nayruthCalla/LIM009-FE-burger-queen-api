db.eval(function(cont,numDoc){
  while (cont <= numDoc) {
    db.users.insertOne({ email: `user00${cont}@localhost`,
     password: "$2b$10$.Jqhq/.CAkjv7CT3mOacqOBp3.DjbK4Bc6YqWZsYvyLDWG50d.Bxq", roles: { admin: false } });
    cont++;    
  }
  
},1,20);

db.system.js.save(
    { _id:"addUsers",
      value: function(cont,numDoc){
        while (cont <= numDoc) {
          db.users.insertOne({ email: `user00${cont}@localhost`,
           password: "$2b$10$.Jqhq/.CAkjv7CT3mOacqOBp3.DjbK4Bc6YqWZsYvyLDWG50d.Bxq", roles: { admin: false } });
          cont++;    
        }
    }
});

  db.eval("addUsers(1,20)");