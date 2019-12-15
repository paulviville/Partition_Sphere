function iterative_partition(points)
{
	let map = CMap2();
	create_core(map, points[0], points[1], points[2]);
	if(points.length > 3) 
		iterate(map, points);

	return map;
}

function create_core(map, A, B, C)
{
	let VERTEX = map.vertex;
	let FACE = map.face;

	let Qs = get_Qs(A, B, C);
	let Ms = get_Ms(A, B, C);

	let d0 = map.add_face(4);
	let d1 = map.add_face(4);
	let d2 = map.add_face(4);

	map.sew_phi2(d0, map.phi1(d1));
	map.sew_phi2(map.phi1(d0), d2);
	map.sew_phi2(map.phi1(map.phi1(d0)), map.phi_1(d2));
	map.sew_phi2(map.phi_1(d0), map.phi1(map.phi1(d1)));
	map.sew_phi2(d1, map.phi1(d2));
	map.sew_phi2(map.phi_1(d1), map.phi1(map.phi1(d2)));

	map.set_embeddings[VERTEX]();
	let pos = map.add_attribute[VERTEX]("position");

	pos[map.cell[VERTEX](d0)] = Ms[0];
	pos[map.cell[VERTEX](d1)] = Ms[1];
	pos[map.cell[VERTEX](d2)] = Ms[2];
	pos[map.cell[VERTEX](map.phi1(d0))] = Qs[0];
	pos[map.cell[VERTEX](map.phi_1(d0))] = Qs[1];

	map.set_embeddings[FACE]();
	let face_point = map.add_attribute[FACE]("face_point");
	face_point[map.cell[FACE](d0)] = A;
	face_point[map.cell[FACE](d1)] = B;
	face_point[map.cell[FACE](d2)] = C;

	return;
}

function get_Qs(A, B, C)
{
	let Qs = [];
	Qs.push(new THREE.Vector3(), new THREE.Vector3())
	let e0 = new THREE.Vector3();
	e0.subVectors(B, A);
	let e1 = new THREE.Vector3();
	e1.subVectors(C, A);
	let medAxis = new THREE.Vector3();
	medAxis.crossVectors(e0, e1);
	medAxis.normalize();
	Qs[0].add(medAxis);
	Qs[1].sub(medAxis);
	return Qs;
}

function get_Ms(A,B,C)
{
	let Ms = new Array(3);
	Ms[0] = slerp(A , B, 0.5);
	Ms[1] = slerp(B , C, 0.5);
	Ms[2] = slerp(C , A, 0.5);
	return Ms;
}

function iterate(map, points)
{
	let VERTEX = map.vertex;
	let FACE = map.face;

	let face_point = map.get_attribute[FACE]("face_point");
	let pos = map.get_attribute[VERTEX]("position");
	for(let i = 3; i < points.length; ++i)
	{
		let P0 = points[i];

		let face_found = false;
		map.foreach[FACE](
			fd => {
				if(face_found) return;
				face_found = 
					in_sphere_quad(
						P0, 
						pos[map.cell[VERTEX](fd)], 
						pos[map.cell[VERTEX](map.phi1(fd))],
						pos[map.cell[VERTEX](map.phi1(map.phi1(fd)))], 
						pos[map.cell[VERTEX](map.phi_1(fd))]
					);

				if(face_found)
				{
					console.log("face found")
					let P1 = face_point[map.cell[FACE](fd)];
					let dia0 = new THREE.Vector3();
					dia0.subVectors(pos[map.cell[VERTEX](fd)], pos[map.cell[VERTEX](map.phi1(map.phi1(fd)))]);
					dia0.normalize();
					let dia1 = new THREE.Vector3();
					dia1.subVectors(pos[map.cell[VERTEX](map.phi_1(fd))], pos[map.cell[VERTEX](map.phi1(fd))]);
					dia1.normalize();
					let mid = new THREE.Vector3();
					mid.subVectors(P0, P1);
					mid.normalize();

					let cut0, cut1;
					if(Math.abs(dia0.dot(mid)) < Math.abs(dia1.dot(mid)))
					{
						cut0 = fd;
						cut1 = map.phi1(map.phi1(fd));
					}
					else
					{
						cut0 = map.phi1(fd);
						cut1 = map.phi_1(fd);
					}
					console.log(map._embeddings[FACE]);

					let new_edge = map.cut_face(cut0, cut1);
					let new_vert = map.cut_edge(new_edge);

					pos[map.cell[VERTEX](new_vert)] = slerp(P0, P1, 0.5);


					let out0 = new THREE.Vector3();
					out0.copy(pos[map.cell[VERTEX](new_vert)]);
					let out1 = new THREE.Vector3();
					out1.subVectors(P0, pos[map.cell[VERTEX](cut0)]).normalize();
					let v1 = new THREE.Vector3();
					v1.subVectors(P1, pos[map.cell[VERTEX](cut0)]).normalize();
					out1.cross(v1);
					let newFace, oldFace;
					if(out1.dot(out0) >= 0)
					{
						newFace = cut0; 
						oldFace = cut1;
					}
					else
					{
						newFace = cut1;
						oldFace = cut0;
					}
					face_point[map.cell[FACE](newFace)] = P0;
					face_point[map.cell[FACE](oldFace)] = P1;
				}
			}
		);

		relax_vertices(map);
	}

	// map.set_embeddings[map.edge]();
}

function relax_vertices(map, cache)
{
	let VERTEX = map.vertex;
	let FACE = map.face;
	let face_point = map.get_attribute[FACE]("face_point");
	let pos = map.get_attribute[VERTEX]("position");
	console.log(map._embeddings);
	map.foreach[VERTEX](
		vd => {
			console.log(vd);
			let new_pos = new THREE.Vector3();
			let points = [];
			map.foreach_dart_of[VERTEX](vd, 
				d => {
					points.push(face_point[map.cell[FACE](d)]);
				});
			// new_pos.normalize();

			switch(points.length)
			{
				case 2:
					new_pos = slerp(points[0], points[1], 0.5);
					break;
				case 3:
					let Qs = get_Qs(points[0], points[1], points[2]);
					if(Qs[0].dot(pos[map.cell[VERTEX](vd)]) > 0)
						new_pos = Qs[0];
					else
						new_pos = Qs[1];
					break;
				default:
					new_pos = pos[map.cell[VERTEX](vd)];
					break;
			}
			pos[map.cell[VERTEX](vd)] = new_pos;
		}
		, cache);
}

function mean_dir(points)
{

}