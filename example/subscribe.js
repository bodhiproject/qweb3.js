import Qweb3 from 'qweb3';

let qweb3 = new Qweb3("http://localhost:13889");

qweb3.subscribe(
    'topicEvent', // name of event to subscribe to 
    [], // any parameters used by event 
    function(error, result) { // callback when the subscription is complete 
        if (!error)
        {
            console.log('subscribe to topEvent channel complete:');
        }
    }
);

qweb3.on('topicEvent', function(event) {

    console.log('Received event: id', event.id, 'type', event.type, 'data', event.data);

    switch (event.type) {
        case 'create':
            console.log('Event created.');
            break;
        case 'update':
            console.log('Event updated.');
            break;
        case 'cancel':
            console.log('Event cancelled.');
            break;
    }
});