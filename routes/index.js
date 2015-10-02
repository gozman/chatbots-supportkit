var express = require('express');
var SupportKit = require('node-supportkit');
var router = express.Router();
var Q = require('q');
var webhookTarget = "http://16d791b2.ngrok.com/usermsg";
var appToken = "d1ob8osm7hlnhj4zcj8mojxd5";

SupportKit.apiUrl = 'https://supportkit-staging.herokuapp.com';
var jwt = SupportKit.jwt.generate({"scope":"app"}, "wLDKW4ihOvOEX440uj3s5PsL", "560da9e857767429000ba158");

function clearWebHooks(hooks) {
	while(hooks.length > 0) {
		var hook = hooks.pop();
		SupportKit.webhooks.destroy("d1ob8osm7hlnhj4zcj8mojxd5", hook._id, jwt);
	}

	return;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/usermsg', function(req, res, next) {
  console.log(req.body);

  SupportKit.messages.create(req.body.items[0].authorId, {"text":req.body.items[0].text, "author":"mike@supportkit.io"}, "appMaker", jwt);

  res.status(200).send("OK");
});

router.post('/setupwebhooks', function(req, res, next) {
	SupportKit.webhooks.list(appToken, jwt).then(function(hooks) {
		console.log(hooks);
		
		if(hooks.length && (hooks.length != 1 || hooks[0].target != webhookTarget)) {
			clearWebHooks(hooks);
			SupportKit.webhooks.create(appToken, webhookTarget, jwt, {"events": ["message:appUser"]});  
		} else if(hooks.length == 0) {
			SupportKit.webhooks.create(appToken, webhookTarget, jwt, {"events": ["message:appUser"]});  
		}
	});

	res.status(200).send("OK");
});

module.exports = router;
