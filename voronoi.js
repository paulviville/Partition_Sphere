function delaunay(points)
{
	let m2 = CMap2();
	m2.set_embeddings[m2.vertex]();
	
	let triangles = convex_hull(points);
    let position = m2.add_attribute[m2.vertex]("position");

	let dart_per_vertex = m2.add_attribute[m2.vertex]("dart_per_vertex");
    
    let vertex_ids = [];
    vertex_ids.length = points.length;

    points.forEach(vertex => {
        let i = m2.new_cell[m2.vertex]();
        vertex_ids.push(i);
        dart_per_vertex[i] = [];
        position[i] = vertex;
    })

    triangles.forEach(face => {
        let d = m2.add_face(face.length);
        for(let i = 0; i < face.length; i++)
        {
			for(let i = 0; i < face.length; i++)
			{
				m2.set_embedding[m2.vertex](d, face[i]);
				dart_per_vertex[face[i]].push(d);
				d = m2.phi1(d);
			}
        }
    });

	return m2;
}

function voronoi(del_map)
{
	let VERTEX = del_map.vertex;
	let FACE = del_map.face;

	let del_pos = del_map.get_attribute[VERTEX]("position");
    let del_ctrs = del_map.add_attribute[FACE]("circumcenters");
	let id = 0;

    del_map.foreach[FACE](
        fd => {
            let a = del_pos[del_map.cell[VERTEX](fd)];
            let b = del_pos[del_map.cell[VERTEX](del_map.phi1(fd))];
            let c = del_pos[del_map.cell[VERTEX](del_map.phi_1(fd))];
            let n = triangle_onsphere_circumcenter(a, b, c);
            circumcenters.push(n);
            del_ctrs[del_map.face(fd)] = id++;
        }
    );

    del_map.foreach[VERTEX](
        vd => {
            let face = [];
            del.foreach_dart_of_orbit_phi21(vd, 
                fd => {
                    face.unshift(del_ctrs[del.face(fd)]);
                }
            );

            voronoi_faces.push(face);
        }
    );
    
    let vor_pos = voronoi_map.get_vertex_attribute("position");
    let dart_per_vertex = voronoi_map.create_vertex_attribute("dart_per_vertex");
    let vertex_ids = [];
    vertex_ids.length = circumcenters.length;
    circumcenters.forEach(vertex => {
        let i = voronoi_map.new_vertex();
        vertex_ids.push(i);
        dart_per_vertex[i] = [];
        vor_pos[i] = vertex;
    })

    voronoi_faces.forEach(face => {
        let d = voronoi_map.add_face(face.length);
        for(let i = 0; i < face.length; i++)
        {
            voronoi_map._vertex_embedding[d] = face[i];
            dart_per_vertex[face[i]].push(d);
            d = voronoi_map.phi1(d);
        }
    });
    console.log(voronoi_map);

    let v0 = -1;
    let v1 = -1;
    voronoi_map.foreach_dart(
        d0 => {
            v0 = voronoi_map.vertex(d0);
            dart_per_vertex[voronoi_map.vertex(voronoi_map.phi1(d0))].forEach(d1 => {
                if(voronoi_map.vertex(voronoi_map.phi1(d1)) == v0)
                {
                    voronoi_map.sew_phi2(d0, d1);
                }
            });
        }
    );
}