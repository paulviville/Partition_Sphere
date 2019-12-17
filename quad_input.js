function create_frames(points)
{
	let rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
	rand_dir.normalize();

	let frames = [];
	points.forEach(p => {
		let x = new THREE.Vector3();
		x.crossVectors(p, rand_dir);
		let y = new THREE.Vector3();
		y.crossVectors(p, x);
		frames.push([x, y]);
	})
	return frames;
}

function create_quads(points, frames)
{
	let quad_points = [];
	let rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
	for(let i = 0; i < points.length; ++i)
	{
	 	rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][0], 0.2).addScaledVector(rand_dir, 0.01).normalize());
	 	rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][1], 0.2).addScaledVector(rand_dir, 0.01).normalize());
		rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][0], -0.2).addScaledVector(rand_dir, 0.01).normalize());
		rand_dir = new THREE.Vector3(Math.random(), Math.random(), Math.random());
		quad_points.push(points[i].clone().addScaledVector(frames[i][1], -0.2).addScaledVector(rand_dir, 0.01).normalize());
	}

	return quad_points;
}