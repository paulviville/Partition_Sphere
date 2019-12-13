// Attributes_Containers : handles creation of attributes ([]  + {remove()})

function Attributes_Container()
{
	return {
		_free_indices: [],
		_attributes: {},
		_nb_elements: 0,

		create_attribute: function(name)
			{
				while(name == "" || this._attributes[name])
					name += "_";

				this._attributes[name] = [];
				let attribute = this._attributes[name];
				attribute.length = this._nb_elements;
				attribute.name = name;
				let attibutes_container = this;

				attribute.delete = function()
				{
					attibutes_container.remove_attribute(this.name)
					this.delete = function(){};
					this.name = "";
				};

				return attribute;
			},

		get_attribute: function(name)
			{
					return (this._attributes[name]? this._attributes[name] : undefined);
			},

		remove_attribute: function(name)
			{
				this._attributes[name].length = 0;
				delete this._attributes[name];
			},

		new_element: function()
			{
				if(this._free_indices.length)
					return this._free_indices.pop();
				
				Object.values(this._attributes).forEach(
					attribute => ++(attribute.length)
				);

				return this._nb_elements++;
			},
        
		delete_element: function(index)
			{
				if(index == this._nb_elements - 1)
				{
					Object.values(this._attributes).forEach(
						attribute => attribute.length = attribute.length - 1
					);
					--this._nb_elements;
				}
				else  
					this._free_indices.push(index);
			},

		nb_elements: function()
			{
				return this._nb_elements - this._free_indices.length;
			},

		delete: function()
			{
				this._free_indices.length = 0;
				this._nb_elements = 0;
				Object.keys(this._attributes).forEach(attr => this.remove_attribute(attr));
			},
	}
}