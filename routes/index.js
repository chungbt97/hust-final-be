module.exports = (app) => {
    require('fs')
        .readdirSync('routes')
        .forEach((fileName) => {
            if (fileName === 'index.js') return;
            if (fileName === 'account.js') {
                app.use('/account/', require(`./${fileName}`));
            };
            if (fileName === 'zalo.js') {
                app.use('/webhook/', require(`./${fileName}`));
            };
            if (['js'].indexOf(fileName.split('.').pop()) === -1) return;
            app.use('/bots/', require(`./${fileName}`));
        });
};
