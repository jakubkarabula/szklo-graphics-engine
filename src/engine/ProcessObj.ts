import { Mesh, Triangle, Vec3d } from './Types'

type ProcessObj = {
  vertices: Vec3d[]
  faces: Mesh
}

const processObj = (objFile: string): ProcessObj => {
  const vertices: Vec3d[] = [makeVertex(null, null, null)]
  const faces: Mesh = []

  objFile.split(/\n/g).forEach((line) => {
    let [type, ...parts] = line.split(' ')

    parts = parts.filter((p) => p)

    switch (type) {
      case 'v':
        vertices.push(makeVertex(parts[0], parts[1], parts[2]))
        return

      case 'f':
        faces.push(faceToVertices(vertices)(parts))
        return

      default:
        return
    }
  })

  return { vertices, faces }
}

const makeVertex = (x, y, z): Vec3d => ({ x, y, z })

/*
The lines starting with "f" define the 12 faces of the cube. Each face is defined by a list of vertices, and each vertex has an associated normal. For example, the front face of the cube is defined by vertices 2,4,6, and 8. Vertex 2 is (0,0,1), which is the lower left of the front face. Going counter-clockwise, we get 2, 6, 8 and 4. Breaking that quad into two triangles, we get 2,6,8 and 2,8,4. Looking at the last two faces, we see:
f  2//1  6//1  8//1 
f  2//1  8//1  4//1 
The vertex numbers are before the // and the index of the surface normal follows the //. In this case, all the vertices have the same surface normal, since the face is flat.
*/
const faceToVertices = (vertices) => (face): Triangle => {
  return face.map((faceVertex) => {
    const vertexIndex = faceVertex.split('/')[0]

    return vertices[vertexIndex]
  })
}

export default processObj
