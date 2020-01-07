function create_frames(points)
{
	let frames = [];
	points.forEach(p => {
		frames.push(create_frame(p));
	})
	return frames;
}

function create_frame(point)
{
	let rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
	rand_dir.normalize();

	let x = new THREE.Vector3();
		x.crossVectors(point, rand_dir).normalize();
		let y = new THREE.Vector3();
		y.crossVectors(point, x).normalize();
		return [x, y];
}

function create_quads(points, frames)
{
	let quad_points = [];
	let rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
	for(let i = 0; i < points.length; ++i)
	{
	 	rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][0], 0.1).addScaledVector(rand_dir, 0.0005).normalize());
	 	rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][1], 0.1).addScaledVector(rand_dir, 0.0005).normalize());
		rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][0], -0.1).addScaledVector(rand_dir, 0.0005).normalize());
		rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][1], -0.1).addScaledVector(rand_dir, 0.0005).normalize());
	}

	return quad_points;
}

function mark_vertices_seed(map)
{
    let DART = map.dart;
    let VERTEX = map.vertex;
    let EDGE = map.edge;
    let FACE = map.face;

    let seed_ids = map.get_attribute[FACE]("seed_id");
    map.set_embeddings[DART]();
    let dart_ids = map.add_attribute[DART]("dart_ids");
    let vertex_colors = map.add_attribute[VERTEX]("vertex_colors");

    let nb_faces = 0;
    map.foreach[FACE](fd => {
        let id = Math.floor(seed_ids[map.cell[FACE](fd)] / 4);

        map.foreach_dart_of[FACE](fd, d => {
            dart_ids[d] = id;
        });
        
        ++nb_faces;
    });
    
    map.foreach[VERTEX](vd => {
        let colors = [];
        map.foreach_dart_of[VERTEX](vd, d => {
            colors.push(dart_ids[d]);
        });

        colors.sort();
        let count = 1;
        for(let i = 0; i < colors.length - 1; ++i)
        {
            if(colors[i] < colors[i + 1])
                ++count;
        }
        vertex_colors[map.cell[VERTEX](vd)] = count;
    });

    let frame_edges = [];
    for(let i = 0; i < nb_faces / 4; ++i)
    {
        frame_edges.push([]);
    }

    map.foreach[EDGE](ed => {

        let nbc0 = vertex_colors[map.cell[VERTEX](ed)];
        let nbc1 = vertex_colors[map.cell[VERTEX](map.phi2(ed))];
 
        if((nbc0 == 1 && nbc1 != 1))
        {
            let frame_id = dart_ids[ed];
            frame_edges[frame_id].push(ed);
        }
        if((nbc1 == 1 && nbc0 != 1))
        {
            let frame_id = dart_ids[ed];
            frame_edges[frame_id].push(map.phi2(ed));
        }
    });

    return frame_edges;
}