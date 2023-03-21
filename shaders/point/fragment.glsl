
uniform vec3 color;
void main(){
  float distanceToCenter=distance(gl_PointCoord,vec2(.5));
  float strength=distanceToCenter*2.;
  strength=1.-strength;
  strength=pow(strength,1.5);
  gl_FragColor=vec4(color,strength);
}