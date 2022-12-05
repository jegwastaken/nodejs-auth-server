import mongoose from 'mongoose';

let attempts = 1;
const maxAttempts = 5;

(function attemptConnect() {
    mongoose.connect(process.env.MONGOURI || '', (err) => {
        if(err) {
            console.error(`Attempt ${attempts}:`, err);

            if(attempts < maxAttempts) {
                attempts += 1;

                setTimeout(attemptConnect, 1000 * 3);
            } else {
                attempts = 0;

                console.log(
                    `Maximum attempts reached. Will try again in ${maxAttempts} minutes.`,
                );

                setTimeout(attemptConnect, 1000 * 60 * maxAttempts);
            }
        } else {
            console.log(
                `Connected to database '${mongoose.connection.db.databaseName}'`,
            );
        }
    });
}());
