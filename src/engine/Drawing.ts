import { Mesh, newTriangle, Triangle, Vec3d } from './Types'
import { cos, Matrix, pi, sin, tan, zeros } from 'mathjs'

let fTheta = 0

const Drawing = (W: number, H: number, backgroundColor: string, context: CanvasRenderingContext2D) => {
    const clear = () => {
        context.fillStyle = backgroundColor
        context.fillRect(0, 0, W, H); 
    }

    const drawMesh = (mesh: Mesh, time: number) => {
        const fNear = 0.1
        const fFar = 1000.0
        const fFov = 90.0
        const fAspectRatio = H / W
        const fFovRad = 1.0 / tan(fFov * 0.5 / 180.0 * pi)

        const matProj: Matrix = zeros([4, 4]) as Matrix

        matProj[0][0] = fAspectRatio * fFovRad;
        matProj[1][1] = fFovRad;
        matProj[2][2] = fFar / (fFar - fNear);
        matProj[3][2] = (-fFar * fNear) / (fFar - fNear);
        matProj[2][3] = 1.0;
        matProj[3][3] = 0.0;

        // Set up rotation matrices
		const matRotZ: Matrix = zeros([4, 4]) as Matrix
        const matRotX: Matrix = zeros([4, 4]) as Matrix
        const matRotY: Matrix = zeros([4, 4]) as Matrix

		fTheta += 1.0 * time;

		// Rotation Z
		matRotZ[0][0] = cos(fTheta);
		matRotZ[0][1] = sin(fTheta);
		matRotZ[1][0] = -sin(fTheta);
		matRotZ[1][1] = cos(fTheta);
		matRotZ[2][2] = 1.0;
		matRotZ[3][3] = 1.0;

        // Rotation X
		matRotX[0][0] = 1.0;
		matRotX[1][1] = cos(fTheta * 0.5);
		matRotX[1][2] = sin(fTheta * 0.5);
		matRotX[2][1] = -sin(fTheta * 0.5);
		matRotX[2][2] = cos(fTheta * 0.5);
		matRotX[3][3] = 1.0;

         // Rotation Y
		matRotY[0][0] = cos(fTheta * 0.5);
		matRotY[1][1] = 1.0;
		matRotY[2][2] = cos(fTheta * 0.5);
		matRotY[2][0] = -sin(fTheta * 0.5);
		matRotY[0][2] = sin(fTheta * 0.5);
		matRotY[3][3] = 1.0;

        // console.log(matRotZ, matRotX)

        
        for(let i = 0; i < mesh.length; i++) {
            const triangle = mesh[i]
            let t: Triangle = newTriangle()
            let triRotatedZ: Triangle = newTriangle()
            let triRotatedZX: Triangle = newTriangle()

            // Rotate in Z-Axis
            MultiplyMatrixVector(triangle[0], triRotatedZ[0], matRotZ);
            MultiplyMatrixVector(triangle[1], triRotatedZ[1], matRotZ);
            MultiplyMatrixVector(triangle[2], triRotatedZ[2], matRotZ);

            // Rotate in X-Axis
            MultiplyMatrixVector(triRotatedZ[0], triRotatedZX[0], matRotY);
			MultiplyMatrixVector(triRotatedZ[1], triRotatedZX[1], matRotY);
			MultiplyMatrixVector(triRotatedZ[2], triRotatedZX[2], matRotY);

            // Offset into the screen
            const translated = triRotatedZX
            translated[0].z += triRotatedZX[0].z + 5.5
            translated[1].z += triRotatedZX[1].z + 5.5
            translated[2].z += triRotatedZX[2].z + 5.5

            // Project triangles from 3D --> 2D
            MultiplyMatrixVector(translated[0], t[0], matProj)
            MultiplyMatrixVector(translated[1], t[1], matProj)
            MultiplyMatrixVector(translated[2], t[2], matProj)

            t[0].x += 1.0;  t[0].y += 1.0
            t[1].x += 1.0;  t[1].y += 1.0
            t[2].x += 1.0;  t[2].y += 1.0
            t[0].x *= 0.5 * W;  t[0].y *= 0.5 * H;
            t[1].x *= 0.5 * W;  t[1].y *= 0.5 * H;
            t[2].x *= 0.5 * W;  t[2].y *= 0.5 * H;

            drawTriangle(t[0], t[1], t[2], context)
        }
    }

    return {
        clear,
        drawMesh
    }
}

export const MultiplyMatrixVector = (i: Vec3d, o: Vec3d, m: Matrix) =>
{
    o.x = i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0];
    o.y = i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1];
    o.z = i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2];
    const w = i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3];

    if (w !== 0.0)
    {
        o.x /= w; o.y /= w; o.z /= w;
    }
}

const drawTriangle = (p: Vec3d, q: Vec3d, r: Vec3d, context: CanvasRenderingContext2D) => {
    // console.log(p, q, r)

    context.strokeStyle = 'white';
    context.beginPath()
    context.moveTo(p.x, p.y)
    context.lineTo(q.x, q.y)
    context.lineTo(r.x, r.y)
    context.lineTo(p.x, p.y)
    context.stroke()
    context.closePath()
}

export default Drawing