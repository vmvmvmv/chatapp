var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jedi';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createAt).toBeA('string');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Jeda';
    var latitude = 11;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=11,19';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createAt).toBeA('string');
    expect(message).toInclude({from, url});
  });
});