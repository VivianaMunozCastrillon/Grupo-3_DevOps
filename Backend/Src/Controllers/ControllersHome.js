const Home = async (req, res) => {
    try {
       

        res.status(200).send("Estas en la pagina principal");
    } catch (error) {
        console.error('Error al obtener la pagina principal', error);
        res.status(500).json({ error: 'Error al obtener la pagina principal' });
    }
};

module.exports = Home;