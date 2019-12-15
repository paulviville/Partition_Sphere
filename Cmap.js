"use strict";

const CMap_Base = {
	dart: 0,
	_attributes_containers: undefined,
	_topology: undefined,
	_boundary_marker: undefined,
	_embeddings: undefined,
	

	foreach_dart: function(func)
		{
			this._topology.d.forEach(d => {
				if(d != -1)
					func(d);
			});
		},

	new_dart: function()
		{
			let new_id = this._attributes_containers[this.dart].new_element();
			Object.values(this._topology).forEach(relation => relation[new_id] = new_id);
			return new_id;
		},

	delete_dart: function(d)
		{
			this._topology.d[d] = -1;
			this._attributes_containers[this.dart].delete_element(d);
		},

	mark_as_boundary: function(d)
		{
			this._boundary_marker[d] = true;
		},

	is_boundary: function(d)
		{
			return this._boundary_marker[d];
		},
	
	nb_darts: function()
		{
			return this._attributes_containers[this.dart].nb_elements();
		},

	delete_map: function()
		{
			this._topology = null;
			this._attributes_containers.forEach(ac => ac.delete());
			this._attributes_containers = null;
		},

	create_dart_marker: function()
		{
			let cmap = this;
			let marker = this.add_attribute[this.dart]("<!>dart_marker")
			marker.mark_cell = function(orbit){cmap.foreach_dart}
			return marker;
		},

	foreach: undefined,
	foreach_dart_of: undefined,

	add_attribute: undefined,
	get_attribute: undefined,
	remove_attribute: undefined,
	new_cell: undefined,

	create_embedding: undefined,
	is_embedded: undefined,
	set_embedding: undefined,
	set_embeddings: undefined,
	cell: undefined,
}

const CMap_Utils = {
	add_relation: function(cmap, name)
		{
			cmap._topology[name] = cmap.add_attribute[cmap.dart]("<topo_" + name + ">");
		},

	add_celltype: function(cmap)
		{
			let emb = cmap._attributes_containers.length;
			const attrib_container = Attributes_Container();
			cmap._attributes_containers.push(attrib_container);
			cmap.add_attribute.push(function(name){return attrib_container.create_attribute(name)});
			cmap.get_attribute.push(function(name){return attrib_container.get_attribute(name)});
			cmap.remove_attribute.push(function(attrib){attrib_container.remove_attribute(attrib.name)});
			cmap.new_cell.push(function(){return attrib_container.new_element()});
			
			cmap._embeddings.push(null);
			cmap.create_embedding.push(function(){
				cmap._embeddings[emb] = cmap.add_attribute[cmap.dart]("<emb_" + emb + ">")});
			cmap.is_embedded.push(function(){return !(cmap._embeddings[emb] === null);})
			cmap.cell.push(function(d){return cmap._embeddings[emb][d]});
			cmap.set_embedding.push(function(d, i){cmap._embeddings[emb][d] = i;})
		},
}

function CMap0()
{
	const cmap = Object.create(CMap_Base);

	cmap._attributes_containers = [];
	cmap._topology = {};
	cmap.add_attribute = [];
	cmap.get_attribute = [];
	cmap.remove_attribute = [];
	cmap.new_cell = [];
	cmap.cell = [];
	cmap.create_embedding = [];
	cmap.is_embedded = [];
	cmap.set_embedding = [];
	cmap.set_embeddings = [];
	cmap._embeddings = [];
	cmap.foreach = [];
	cmap.foreach_dart_of = [];

	CMap_Utils.add_celltype(cmap);
	CMap_Utils.add_relation(cmap, "d");

	cmap._boundary_marker = cmap.add_attribute[cmap.dart]("<boundary>");
	
	cmap.vertex = 1;
	CMap_Utils.add_celltype(cmap);

	// set dart embedding
	cmap.set_embeddings.push(function(){
		if(!cmap.is_embedded[cmap.dart]())
			cmap.create_embedding[cmap.dart]()
		cmap.foreach_dart(d => {
			cmap.set_embedding[cmap.dart](d, d);
		})
	});

	// set vertex embedding
	cmap.set_embeddings.push(function(){
		if(!cmap.is_embedded[cmap.vertex]())
			cmap.create_embedding[cmap.vertex]()
		cmap.foreach_dart(d => {
			cmap.set_embedding[cmap.vertex](d, cmap.new_cell[cmap.vertex]());
		})
	});

	// foreach dart of orbit dart
	cmap.foreach_dart_of.push(func => {func(d)});
	// foreach dart of orbit vertex
	cmap.foreach_dart_of.push(func => {func(d)});

	// foreach dart
	cmap.foreach.push(
		(func, cache) => {
			if(cache)
			{
				cache.forEach(d => func(d));
				return;
			}
		
			cmap.foreach_dart(d => func(d))
		});

	// foreach vertex
	cmap.foreach.push(
		(func, cache) => {
			if(cache)
			{
				cache.forEach(vd => func(vd));
				return;
			}

			cmap.foreach_dart(d => func(d))
		});
	
	return cmap;
}

function CMap1()
{
	const cmap1 = CMap0();

	CMap_Utils.add_relation(cmap1, "phi1");
	CMap_Utils.add_relation(cmap1, "phi_1");

	cmap1.phi1 = function(d){return this._topology.phi1[d]};
	cmap1.phi_1 = function(d){return this._topology.phi_1[d]};

	cmap1.edge = 2;
	CMap_Utils.add_celltype(cmap1);

	cmap1.face = 3;
	CMap_Utils.add_celltype(cmap1);

	cmap1.sew_phi1 = function(d0, d1)
		{
			let e0 = this._topology.phi1[d0];
			let e1 = this._topology.phi1[d1];
			this._topology.phi1[d0] = e1;
			this._topology.phi1[d1] = e0;
			this._topology.phi_1[e1] = d0;
			this._topology.phi_1[e0] = d1;
		};

	cmap1.unsew_phi1 = function(d0)
		{
			let d1 = this._topology.phi1(d0);
			let d2 = this._topology.phi1(d1);
	
			this._topology.phi1[d0] = d2;
			this._topology.phi1[d1] = d1;
			this._topology.phi_1[d2] = d0;
			this._topology.phi_1[d1] = d1;
		};
	
	cmap1.foreach_dart_phi1 = function(d0, func)
	{
		let d = d0;
		do
		{
			func(d);
			d = this.phi1(d);
		} while (d != d0);
	};

	// foreach dart of edge 
	cmap1.foreach_dart_of.push(func => {func(d)});
	// foreach dart of face 
	cmap1.foreach_dart_of.push((d0, func) => {
		cmap1.foreach_dart_phi1(d0, func);
	});
	
	// foreach edge
	cmap1.foreach.push(func => { cmap1.foreach_dart(d => func(d))});
	// foreach face
	cmap1.foreach.push(func => {
		let marker = cmap1.create_dart_marker();
		// console.log(marker.length);
		cmap1.foreach_dart(
			d => {
				if(marker[d])
					return;

				cmap1.foreach_dart_phi1(d, d1 => {marker[d1] = true});

				func(d);
			}
		);
	});
	
	// set edge embedding
	cmap1.set_embeddings.push(function(){
		if(!cmap1.is_embedded[cmap1.edge]())
			cmap1.create_embedding[cmap1.edge]()
		cmap1.foreach_dart(d => {
			cmap1.set_embedding[cmap1.edge](d, cmap1.new_cell[cmap1.edge]());
		})
	});

	// set face embedding
	cmap1.set_embeddings.push(function(){
		if(!cmap1.is_embedded[cmap1.face]())
			cmap1.create_embedding[cmap1.face]()

		cmap1.foreach[cmap1.face](fd => {
			let fid = cmap1.new_cell[cmap1.face]();
			cmap1.foreach_dart_phi1(fd,
				d => {
					cmap1.set_embedding[cmap1.face](d, fid);
				}
			);
		});
	});

	cmap1.add_face = function(nb_sides, set_embeddings = true)
		{
			let d0 = this.new_dart();
			for(let i = 1; i < nb_sides; i++)
			{
				let d1 = this.new_dart();
				this.sew_phi1(d0, d1);
			}
			return d0;
		}

	cmap1.cut_edge = function(ed, set_embeddings = true)
		{
			let d0 = ed;
			let d1 = cmap1.new_dart();

			cmap1.sew_phi1(d0, d1);

			if(set_embeddings){
				if(cmap1.is_embedded[cmap1.vertex]())
					cmap1.set_embedding[cmap1.vertex](d1, cmap1.new_cell[cmap1.vertex]());
			}

			return d1;
		}

	return cmap1;
}

function CMap2()
{
	const cmap2 = CMap1();

	CMap_Utils.add_relation(cmap2, "phi2");

	cmap2.volume = 4;
	CMap_Utils.add_celltype(cmap2);

	cmap2.phi2 = function(d){return this._topology.phi2[d]};

	cmap2.sew_phi2 = function(d0, d1)
		{
			this._topology.phi2[d0] = d1;
			this._topology.phi2[d1] = d0;
		};

	cmap2.unsew_phi2 = function(d)
		{
			let d1 = this._topology.phi2[d];
			this._topology.phi2[d] = d;
			this._topology.phi2[d1] = d1;
		};

	cmap2.foreach_dart_phi2 = function(d0, func)
		{
			func(d);
			func(this.phi2(d));	
		}

	cmap2.foreach_dart_phi12 = function(d0, func)
		{
			let d = d0;
			do
			{
				func(d);
				d = this.phi1(this.phi2(d));
			} while (d != d0);
		};

	cmap2.foreach_dart_phi1_phi2 = function(d0, func)
		{

		};

	cmap2.foreach_dart_of[cmap2.vertex] = function(d0, func)
		{
			cmap2.foreach_dart_phi12(d0, func);
		}

	cmap2.foreach_dart_of[cmap2.edge] = function(d0, func)
		{
			cmap2.foreach_dart_phi2(d0, func);
		}

	cmap2.foreach[cmap2.vertex] = function(func, cache)
		{
			if(cache)
			{
				cache.forEach(vd => func(vd));
				return;
			}
			
			let marker = cmap2.create_dart_marker();
			cmap2.foreach_dart(
				d => {
					if(marker[d])
						return;

					cmap2.foreach_dart_phi12(d, d1 => {marker[d1] = true});
					func(d);
				}
			);
		}

	cmap2.foreach[cmap2.edge] = function(func, cache)
		{
			if(cache)
			{
				cache.forEach(ed => func(ed));
				return;
			}

			let marker = cmap2.create_dart_marker();
				cmap2.foreach_dart(
					d => {
						if(marker[d])
							return;

						marker[d] = true;
						marker[cmap2.phi2(d)] = true;

						func(d);
					}
				);
		}

	cmap2.set_embeddings[cmap2.vertex] = function()
		{
			if(!cmap2.is_embedded[cmap2.vertex]())
				cmap2.create_embedding[cmap2.vertex]()

			cmap2.foreach[cmap2.vertex](vd => {
				let vid = cmap2.new_cell[cmap2.vertex]();
				cmap2.foreach_dart_phi12(vd,
					d => {
						cmap2.set_embedding[cmap2.vertex](d, vid);
					}
				);
			});
		}
		
	cmap2.set_embeddings[cmap2.edge] = function()
		{
			if(!cmap2.is_embedded[cmap2.edge]())
				cmap2.create_embedding[cmap2.edge]()

			cmap2.foreach[cmap2.edge](ed => {
				let eid = cmap2.new_cell[cmap2.edge]();
				cmap2.foreach_dart_phi12(ed,
					d => {
						cmap2.set_embedding[cmap2.edge](d, eid);
					}
				);
			});
		}

	cmap2.cut_edge1 = cmap2.cut_edge;
	cmap2.cut_edge = function(ed, set_embeddings = true)
		{
			let d0 = ed;
			let e0 = this._topology.phi2[d0];
			this.unsew_phi2(d0);

			let d1 = this.cut_edge1(d0, false);
			let e1 = this.cut_edge1(e0, false);

			this.sew_phi2(d0, e1);
			this.sew_phi2(e0, d1);	

			if(set_embeddings){
				if(cmap2.is_embedded[cmap2.vertex]())
				{
					let vid = cmap2.new_cell[cmap2.vertex]()
					cmap2.set_embedding[cmap2.vertex](d1, vid);
					cmap2.set_embedding[cmap2.vertex](e1, vid);
				}
				if(cmap2.is_embedded[cmap2.face]())
				{
					cmap2.set_embedding[cmap2.face](d1, cmap2.cell[cmap2.face](d0));
					cmap2.set_embedding[cmap2.face](e1, cmap2.cell[cmap2.face](e0));
				}
			}

			return d1;
		}
	
	cmap2.cut_face = function(fd0, fd1, set_embeddings = true)
		{
			let d0 = this._topology.phi_1[fd0];
			let d1 = this._topology.phi_1[fd1];

			let e0 = this.new_dart();
			let e1 = this.new_dart();
			this.sew_phi2(e0, e1);
			this.sew_phi1(d0, e0);
			this.sew_phi1(d1, e1);
			this.sew_phi1(e0, e1);

			if(set_embeddings){
				if(this.is_embedded[cmap2.vertex]())
				{
					this.set_embedding[cmap2.vertex](e0, this.cell[this.vertex](this.phi1(this.phi2(e0))));
					this.set_embedding[cmap2.vertex](e1, this.cell[this.vertex](this.phi1(this.phi2(e1))));
				}
				if(this.is_embedded[cmap2.face]())
				{
					this.set_embedding[cmap2.face](e0, this.cell[this.face](this.phi1(e0)));
					let fid = this.new_cell[this.face]();
					this.foreach_dart_phi1(e1,
						d => {
							this.set_embedding[this.face](d, fid);
						}
					);
				}
			}
			// if(this._vertex_embedding != undefined)
			// {
			// 	this._vertex_embedding[e0] = this._vertex_embedding[fd0];
			// 	this._vertex_embedding[e1] = this._vertex_embedding[fd1];
			// }
			// if(this._edge_embedding != undefined)
			// {
			// 	let eid = this.new_edge();
			// 	this._edge_embedding[e0] = eid;
			// 	this._edge_embedding[e1] = eid;
			// }
			// if(this._face_embedding != undefined)
			// {
			// 	let fid0 = this._embedding[fd0]; 
			// 	let fid1 = this.new_face(); 
			// 	this.foreach_dart_of_orbit_phi1(fd0, d => {
			// 		this._face_embedding[d] = fid0;
			// 	});
			// 	this.foreach_dart_of_orbit_phi1(fd1, d => {
			// 		this._face_embedding[d] = fid1;
			// 	});
			// }
			return e0;
		}

	return cmap2;
}

// function CMap3()
// {
// 	const cmap3 = CMap2();

// 	cmap3.phi3 = function(d){return this._topology.phi3[d]};

// 	cmap3.sew_phi3 = function(d0, d1)
// 		{
// 			this._topology.phi3[d0] = d1;
// 			this._topology.phi3[d1] = d0;
// 		};

// 	cmap3.unsew_phi3 = function(d)
// 		{
// 			let d1 = this._topology.phi3[d];
// 			this._topology.phi3[d] = d;
// 			this._topology.phi3[d1] = d1;
// 		};

// 	//add foreach dart of phi23
// 	//add foreach dart of phi13
// 	//add foreach dart of phi1_phi2_phi3


// 	return cmap3;
// }


function load_off(off_str)
{
	let lines = off_str.split("\n");
	for(let i = 0; i < lines.length; i++)
	{
		lines[i] = lines[i].replace(/\s\s+/g, ' ').trim();
	}
	let line;
	// skip header
	while(!parseInt(line = lines.shift()) && lines.length)
	{}
	// get nb_vert nb_face nb_edge(=0)
	let v_f_e = line.split(" ");
	// get vertices positions
	let vertices = [];
	for(let i = 0; i < v_f_e[0]; i++)
	{
		line = lines.shift();
		vertices.push(line.split(" "));
	}        
	// get faces id
	let faces = [];
	for(let i = 0; i < v_f_e[1]; i++)
	{
		line = lines.shift();
		let face0 = line.split(" ");
		let v_nb = face0.shift();
		faces.push(face0);
	}
	vertices = vertices.map(x => x.map(y => parseFloat(y)));
	faces = faces.map(x => x.map(y => parseInt(y)));
	
	console.log("file loaded: " + vertices.length + " vertices, " + faces.length + " faces");
	return {v: vertices, f:faces};
}

function cmap2_from_geometry(geo_info)
{
	let cmap2 = CMap2();
	let position = cmap2.add_attribute[cmap2.vertex]("position");
	let dart_per_vertex = cmap2.add_attribute[cmap2.vertex]("dart_per_vertex");
	
	let vertex_ids = [];
	vertex_ids.length = geo_info.v.length;
	geo_info.v.forEach(vertex => {
		let i = cmap2.new_cell[cmap2.vertex]();
		vertex_ids.push(i);
		dart_per_vertex[i] = [];
		position[i] = new THREE.Vector3(vertex[0], vertex[1], vertex[2]);
	})

	cmap2.set_embeddings[cmap2.vertex]();
	geo_info.f.forEach(face => {
		let d = cmap2.add_face(face.length);
		for(let i = 0; i < face.length; i++)
		{
			cmap2.set_embedding[cmap2.vertex](d, face[i]);
			dart_per_vertex[face[i]].push(d);
			d = cmap2.phi1(d);
		}
	});

	let v0 = -1;
	cmap2.foreach_dart(
		d0 => {
			v0 = cmap2.cell[cmap2.vertex](d0);
			dart_per_vertex[cmap2.cell[cmap2.vertex](cmap2.phi1(d0))].forEach(d1 => {
				if(cmap2.cell[cmap2.vertex](cmap2.phi1(d1)) == v0)
				{
					cmap2.sew_phi2(d0, d1);
				}
			});
		}
	);

	return cmap2;
}