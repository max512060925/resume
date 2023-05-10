attribute vec3 diff;
uniform float time;
uniform float size;

void main(){
  vec4 modelPosition=modelMatrix*vec4(position,1.);
  modelPosition.xyz+=(diff*time);
  vec4 viewPosition=viewMatrix*modelPosition;
  // 设置顶点坐标
  gl_Position=projectionMatrix*viewPosition;
  // 设置顶点大小
  gl_PointSize=size;
}