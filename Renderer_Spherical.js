function Renderer_Spherical(map)
{
    let renderer = Renderer(map);
    renderer.create_geodesics = function(color = 0x000000)
    {
        if(this.geodesics) return;

        let map = this.cmap;
        let vertex = map.vertex;
        let edge = map.edge;
        let position = map.get_attribute[vertex]("position");
        let material = new THREE.LineBasicMaterial({color:color});
        this.geodesics = new THREE.Group();

        map.foreach[edge](
            ed => {
                let line = new THREE.Line(new THREE.Geometry(), material);
                line.geometry.vertices = new_geodesic(
                    position[map.cell[vertex](ed)], 
                    position[map.cell[vertex](map.phi1(ed))],
                    100);
                this.geodesics.add(line);
            }
        );
    };

    renderer.create_curved_faces = function(color)
    {
        const map = this.cmap;
        const vertex = map.vertex;
        const face = map.face;
        const pos = map.get_attribute[vertex]("position");

        this.curved_faces = new THREE.Group();

        map.foreach[face](
            fd => {
                let vertices = []
                let centroid = new THREE.Vector3();
                map.foreach_dart_of[face](fd, 
                    d => {
                        centroid.add(pos[map.cell[vertex](d)]);
                        vertices.push(pos[map.cell[vertex](d)]);
                    }
                );
                centroid.normalize();

                let material = new THREE.MeshLambertMaterial({color: 0xFFFFFF * Math.random()});
                for(let i = 0; i < vertices.length; ++i)
                {
                    let divs = 10;
                    let geometry = new THREE.Geometry();
                    geometry.vertices.push(...subdivide_triangle(centroid, vertices[i], vertices[(i+1) % vertices.length], divs));
                    let n = 1;
                    let k = 0;
                    while(n <= divs)
                    {
                        let k_max = n + k;
                        let l = k_max;
                        let start = k;
                        while(k < k_max)
                        {
                            if(k == start)
                                geometry.faces.push(new THREE.Face3(k++, l, ++l));
                            else
                            {
                                geometry.faces.push(new THREE.Face3(k, k - 1, l));
                                geometry.faces.push(new THREE.Face3(k++, l, ++l));
                            }
                        } 
                        ++n;
                    }

                    let face_mesh = new THREE.Mesh(geometry, material);
                    this.curved_faces.add(face_mesh);
                }
            }
        );

        return true;
    }
    return renderer;
}