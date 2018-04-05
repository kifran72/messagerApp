/**
 * @param  {Object} app
 */
function initIndex(app, modules) {

    app.get('/', (req, res) => {
        return res.render('index', {
            title: "Page basique !",
            h1: 'Bienvenue sur ma page !'
        });
    });
}

module.exports = initIndex;