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
        // if(color = undefined) 
        //     color = 0xFFFFFF * Math.random();
        
        const map = this.cmap;
        const vertex = map.vertex;
        const face = map.face;
        const pos = map.get_attribute[vertex]("position");

        this.curved_faces = new THREE.Group();

        // let geometry = new THREE.Geometry();

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
                // geometry.vertices.push(centroid);

                let geometry = new THREE.Geometry();
                geometry.vertices.push(centroid, ...vertices);
                for(let i = 0; i < vertices.length; ++i)
                {
                    geometry.faces.push(new THREE.Face3(0, i+1, (i+1) % vertices.length +1 ))
                }
                let material = new THREE.MeshBasicMaterial({color: 0xFFFFFF * Math.random()});
                let mesh = new THREE.Mesh(geometry, material);
                this.curved_faces.add(mesh);
            }
        );

        // let material = new THREE.PointsMaterial({color: 0xFFFFFF * Math.random(), size: 0.025});
        // this.curved_faces = new THREE.Points(geometry, material);
        return true;
    }
    return renderer;
}