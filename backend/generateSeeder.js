
const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = 'mongodb://bhavishybhaisaniya1432_db_user:mYo9ExyeKTyu0w6r@ac-isjawpj-shard-00-00.1lbuwsd.mongodb.net:27017,ac-isjawpj-shard-00-01.1lbuwsd.mongodb.net:27017,ac-isjawpj-shard-00-02.1lbuwsd.mongodb.net:27017/?ssl=true&replicaSet=atlas-4adcig-shard-0&authSource=admin&appName=Cluster0';

async function generateSeeder() {
    try {
        await mongoose.connect(MONGO_URI);

        const db = mongoose.connection.db;

        const servicePlans = await db
            .collection('serviceplans')
            .find({})
            .sort({ sort_order: 1 })
            .toArray();

        const durations = await db
            .collection('serviceplandurations')
            .find({})
            .toArray();

        const features = await db
            .collection('serviceplanfeatures')
            .find({})
            .toArray();

        const servicesToAdd = servicePlans.map(plan => {

            const relatedDurations = durations
                .filter(duration =>
                    duration.service_plan?.toString() === plan._id.toString()
                )
                .map(duration => {

                    const relatedFeatures = features
                        .filter(feature =>
                            feature.service_plan_duration?.toString() === duration._id.toString()
                        )
                        .map(feature => ({
                            text: feature.text
                        }));

                    return {
                        duration: duration.duration,
                        duration_type: duration.duration_type,
                        duration_months: duration.duration_months,
                        price: duration.price,
                        features: relatedFeatures
                    };
                });

            return {
                name: plan.name,
                tagline: plan.tagline,
                featured: plan.featured,
                status: plan.status,
                sort_order: plan.sort_order,
                button_text: plan.button_text,
                durations: relatedDurations
            };
        });

        console.log(
            JSON.stringify(
                servicesToAdd,
                null,
                4
            )
        );

        const fileContent = `
const axios = require('axios');

// const API_URL = 'http://localhost:5001/api/v1/services';
const API_URL = 'https://therapidinvestors.com/api/v1/services';

const servicesToAdd = ${JSON.stringify(servicesToAdd, null, 4)};

async function seedServices() {
    for (const service of servicesToAdd) {
        try {
            console.log(\`Adding \${service.name}...\`);
            await axios.post(API_URL, service);
            console.log(\`Success: \${service.name} added.\`);
        } catch (error) {
            console.error(
                \`Error adding \${service.name}:\`,
                error.response?.data || error.message
            );
        }
    }

    console.log('All services processed.');
}

seedServices();
`;

        fs.writeFileSync(
            './generated-service-seeder.js',
            fileContent
        );

        console.log(
            '\n✅ generated-service-seeder.js created successfully'
        );

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

generateSeeder();

