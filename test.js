const { ClientProxyFactory, Transport } = require('@nestjs/microservices');

const client = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 3001,
  },
});

client.send('quiz', JSON.stringify({"qustion": "How to properly use a screwdriver?", "rightAnswear": "A screwdriver should be used by placing it on the screw head and turning it in a circular motion.", "userAnswaer": "A screwdriver should be used by placing it on the screw head and turning it in a circular motion.  Different screws may need different types of screwdrivers"})).subscribe(response => {
  console.log(response);
});
