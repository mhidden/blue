module.exports.Serialize = function Serialize(object) {
	serializer = {
		'User': ['id','cpf'],
		'Event': ['id', 'name', 'description', 'organizer', 'date', 'capacity', 'event_type', 'published'],
		'Ticket': ['id', 'event_id', 'user_id'],
	}	

	if (object instanceof Array) {
		response = [];
		for (o in object) {
			obj = object[o];
			serialized = {};
			serializerFields = serializer[obj.type];
			for (i in serializerFields) {
				field = serializerFields[i];
				serialized[field] = obj[field];
			}
			response.push(serialized);
		}
		return response;
	} else {
		serialized = {};
		serializerFields = serializer[object.type];
		for (i in serializerFields) {
			field = serializerFields[i]
			serialized[field] = object[field];
		}
		return serialized;
	}
}