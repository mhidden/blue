serializer = {
	middleware: function (req, res, next) {
		res.sendObject = function (object) {
			res.json(serializer.serialize(object));
		}
		next();
	},
	getTicketsLeft: function (object) { 
		if ('Tickets' in object) {
			return (object.capacity - object.Tickets.length);
		}
		return 0;
	},
	serializeObject: function (object) {
		serialized = {};
		serializerFields = this.serializer[object.type];
		for (i in serializerFields) {
			field = serializerFields[i]
			if (typeof(field) == "string") {
				serialized[field] = object[field];	
			} else {
				for (var k in field) {
					serialized[k] = this[field[k]](object);	
				}
			}
		}
		return serialized;
	},
	serialize: function (object) {
		if (object instanceof Array) {
			response = [];
			for (o in object) {
				obj = object[o];
				response.push(this.serializeObject(obj));
			}
			return response;
		} else {
			return this.serializeObject(object);
		}	
	},
	serializer: {
		'User': ['id','cpf'],
		'Event': ['id', 'name', 'description', 'organizer', 'date', 'capacity', 'event_type', 'published', {'tickets_left':'getTicketsLeft'}],
		'Ticket': ['id', 'event_id', 'user_id'],
	},
}

module.exports = serializer