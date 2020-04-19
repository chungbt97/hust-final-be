module.exports = (app) => {
    require('fs')
        .readdirSync('routes')
        .forEach((fileName) => {
            if (fileName === 'index.js' || fileName === 'zalo.js') return;
            if (fileName === 'account.js') {
                app.use('/account/', require(`./${fileName}`));
            };
            if (['js'].indexOf(fileName.split('.').pop()) === -1) return;
            app.use('/bots/', require(`./${fileName}`));
        });
};
