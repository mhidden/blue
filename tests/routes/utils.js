utils = {
	createFutureDate: function (days, startDate) {
		date = new Date();
		if (startDate) {
			date = new Date(startDate);
		}

		date.setDate(date.getDate() + days)
		return date;
  },
  getEventData: function () {
		var data = {
			'name':'Show do RHCP', 
			'description':'Esta é a descrição do show...',
			'organizer':'Grupo RBS',
			'date':utils.createFutureDate(1, undefined).toISOString(),
			'capacity':10,
			'event_type':models.Event.rawAttributes.event_type.values[0],
			'published':true
		}	
		return data;
	},
	getUserData: function () {
		return {'cpf':'000.000.000-00', 'password':'password'}
	},
}

module.exports = utils