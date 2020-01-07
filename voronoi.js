function delaunay(points)
{
	let triangles = convex_hull(points);
	let positions = [];

	points.forEach(p => positions.push([p.x, p.y, p.z]));

	let m2 = cmap2_from_geometry({v: positions, f: triangles});

	return m2;
}

function voronoi(del_map, set_ids)
{
	let VERTEX = del_map.vertex;
	let FACE = del_map.face;

	let del_pos = del_map.get_attribute[VERTEX]("position");
	del_map.set_embeddings[FACE]();
    let del_ctrs = del_map.add_attribute[FACE]("circumcenters");
	let id = 0;

	let circumcenters = [];
    del_map.foreach[FACE](
        fd => {
            let a = del_pos[del_map.cell[VERTEX](fd)];
            let b = del_pos[del_map.cell[VERTEX](del_map.phi1(fd))];
            let c = del_pos[del_map.cell[VERTEX](del_map.phi_1(fd))];
            let n = triangle_onsphere_circumcenter(a, b, c);
            circumcenters.push([n.x, n.y, n.z]);
            del_ctrs[del_map.cell[FACE](fd)] = id++;
        }
    );

    let voronoi_faces = [];
    let voronoi_seed_ids = [];
    del_map.foreach[VERTEX](
        vd => {
            let face = [];
            del_map.foreach_dart_of[VERTEX](vd, 
                fd => {
                    face.unshift(del_ctrs[del_map.cell[FACE](fd)]);
                }
            );
            if(set_ids)
                voronoi_seed_ids.push(del_map.cell[VERTEX](vd));
            voronoi_faces.push(face);
        }
	);
	
    del_map.remove_attribute[FACE](del_ctrs);

    let voronoi_map;
    voronoi_map = cmap2_from_geometry({v:circumcenters, f:voronoi_faces});
    if(set_ids){
        voronoi_map.set_embeddings[FACE]();
        let seed_id = voronoi_map.add_attribute[FACE]("seed_id");
        voronoi_map.foreach[FACE](fd => seed_id[voronoi_map.cell[FACE](fd)] = voronoi_seed_ids.shift());
    }
	return voronoi_map;
}