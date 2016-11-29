module.exports = {
    apiKey: process.env.STRIPE_KEY || '',
    stripePubKey: process.env.STRIPE_PUB_KEY || '',
    defaultPlan: 'free',
    plans: ['free', 'silver', 'gold', 'platinum'],
    planData: {
        'free': {
            name: 'Free',
            price: 0,
        },
        'silver': {
            name: 'Silver',
            price: 9,
        },
        'gold': {
            name: 'Gold',
            price: 19,
        },
        'platinum': {
            name: 'Platinum',
            price: 29,
        }
    }
};
