const { connection, dataSource} = require('../database');
const dotenv = require('dotenv');
const Admin = require('../Entities/Admin');
const bcrypt = require('bcrypt');

dotenv.config();

async function hashPassword(password) {
    const saltRounds = 10; //
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error(err);
      throw new Error('Error al encriptar la contraseña');
    }
  }


 
const Login = async (req, res) => {
    try {
        const { AdminId, PasswordAdmin } = req.body;
        const repository = dataSource.getRepository("Admin");

        if (!AdminId || !PasswordAdmin) {
            return res.status(400).json({ error: 'Se requiere el ID del usuario y la contraseña.' });
        }

        // Buscar el ID
        const user = await repository.findOne({ where: { AdminId: AdminId } });
        if (!user) {
            return res.status(401).json({ error: 'Usuario incorrecto' });
        }

        // Verificar la contraseña proporcionada con la contraseña encriptada almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(PasswordAdmin, user.PasswordAdmin);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Si el ID y la contraseña son correctos, enviar mensaje de éxito 
        res.json({ message: 'Login exitoso' });

    } catch (error) {
        console.error('Error al realizar el login:', error.message);
        res.status(500).json({ error: 'Error al realizar el login' });
    }
};

const createUser = async (req, res) => {
    try {
        const { AdminId, PasswordAdmin } = req.body;
        
        
        const User = { AdminId, PasswordAdmin };
        const hashedPassword = await hashPassword(PasswordAdmin);
        User.PasswordAdmin = hashedPassword;
        const repositorio = dataSource.getRepository("Admin");

        await repositorio.insert(User)
        res.json({ msg: "usuario agregado" });

    } catch (error) {
        console.error('Error al agregar el usuario:', error);
        res.status(400).json({ error: 'Error al agregar el usuario, recuerda que el correo electronico y id de usuarios debe ser unico, ademas recuerda llenar todos los campos'});
    }
}
// Exportar la función de login
module.exports = {
Login, createUser};