const resultado=document.querySelector("#resultado");
const formulario=document.querySelector("#formulario");
const paginacion=document.querySelector("#paginacion");
const registrosPorPagina=40;
let totalPaginas; //para que ese valor se vaya cambiando en todas las funciones por eso se coloca globalmente
let iteradorPaginas;
let paginaActual=1;
window.onload=()=>{

	formulario.addEventListener("submit", validarFormulario)
}

function agregarAlerta(mensaje){
	const alertaExiste=document.querySelector(".bg-red-100");
	if (!alertaExiste) {
	const alerta=document.createElement("P");
	alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-lg", "mx-auto", "mt-6", "text-center");
	alerta.innerHTML=`
	<strong class="font-bold">Error!</strong>
	<span class="block sm:inline">${mensaje}</span>
	`
	formulario.appendChild(alerta);

	setTimeout(()=>{
		alerta.remove();
	}, 3000);
	return;
	}
	
}

function validarFormulario(e){
	e.preventDefault();
	// console.log("enviaste el formulario");
		const terminoBusqueda=document.querySelector("#termino").value;
	// console.log(terminoBusqueda);
	if(terminoBusqueda.trim()===""){
		agregarAlerta("El campo esta vacio");
		return; //para que no ejecute las demas lineas de codigo
	}

	//una vez pasada las validaciones ya mandas llamar la api
	
	// busqueda(terminoBusqueda);
	busqueda();//se le quita la variable ya que necesitamos que sea mas local
}

async function busqueda(){
	const terminoBusqueda=document.querySelector("#termino").value;
	key="34531294-02796f5f66511592230be8eeb";
	url=`https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=${registrosPorPagina}&page=${paginaActual}`; //colocamos el parametro en este caso lo colocamos hasta el siguiente parametro que es por el ampersan&q=yellow hasta ahi se coloca la key
	/*console.log(url);//siempre revisar si la url si muestre el json*/
	/*fetch(url)
		.then(respuesta=>respuesta.json())
		.then(resultado=>{
			//const totalPaginas=calcularPaginas(resultado.totalHits);//primero toma el total de paginas 
			totalPaginas=calcularPaginas(resultado.totalHits); //la variable se declaro arriba de esta manera cada que haga una consulta al buscar imagenes hara el calculo del total de paginas
			mostrarImagenes(resultado.hits);
			console.log(totalPaginas)
		});*/

	try{
		const respuesta=await fetch(url);
		const resultado=await respuesta.json();
		totalPaginas=calcularPaginas(resultado.totalHits); //la variable se declaro arriba de esta manera cada que haga una consulta al buscar imagenes hara el calculo del total de paginas
		mostrarImagenes(resultado.hits);
	}catch(error){
		console.log(error)
	}

}

function calcularPaginas(total){ //aqui toma el total y despues hace la operacion
	return parseInt(Math.ceil(total/registrosPorPagina)); //retorna la operacion y luego se la vuelve a asignar al totalPaginas que declaramos con calcularPaginas
}

/*crear un generador para la paginacion estos son muy utiles por que ya vienen con un iterador y nos permite identificar cuando hemos llegado a la parte final de esa pagina*/

function *crearPaginador(total){
	for(let i=1; i<=total;i++){//itera sobre el total de paginas de acuerdo al total de paginas que ya habiamos calculado
		/*console.log(i);*///va iterando del 1 al total de paginas en este caso si el total es  17 
		yield i; //ya que son puros numeros de paginador
	}
}


function mostrarImagenes(imagenes){

	while(resultado.firstChild){
		resultado.removeChild(resultado.firstChild);
	}
	imagenes.forEach(imagen=>{
		// console.log(imagen)
		const { previewURL, likes, views, largeImageURL}=imagen;
		// console.log(previewURL)
		resultado.innerHTML+=`
		<div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
			<div class="bg-white">
				<img src="${previewURL}" class="w-full" alt="">
				<div class="p-4">
				<p class="font-bold">${likes} <span class="font-light" >Me gusta</span></p>
				<p class="font-bold">${views} <span class="font-light" >Veces visto</span></p>
				<a 
					class="w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1 block"
					href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
				>
				Ver imagen
				</a>
				</div>
			</div>
		</div>
		`;
	});

	//antes de imprimir el paginador se limpia el html
	
	while(paginacion.firstChild){
		paginacion.removeChild(paginacion.firstChild)
	}

	// generamos el html despues de limpiar
	imprimirPaginador(); //para que no tenga tanto codigo la funcion y se pueda organizar
 	
}

//Nota: target="_blank" dirige a otra pagina pero es la vulnerabilidad mas subestimada y se soluciona con un rel="noopener noreferrer" con esto no va a ver problema de seguridad
//los enlaces no toman el margin ni el pading porque son display inline y por eso se debe colocar block


function imprimirPaginador(){
		iteradorPaginas=crearPaginador(totalPaginas); //inicia sin ningun valor pero ya al llegar hasta el resultado de busqueda qie tenga el valor

	/*console.log(iteradorPaginas.next().done); //done indica que ya termino de generar valores y value es el valor de ese iterados . next() es para que se despierte el generador*/

	while(true){ //se ejecuta mientras en cada iteracion sea true pero cuando ya sea done=true  porque desde un inicio es done=false entonces ya no tiene mas valores y se detiene el while cuando ya no tiene mas valor
		const {done, value}=iteradorPaginas.next(); //destructuring del generador del done osea cuando termina y para sacar el valor
		if(done)return; //si ya termino no hagas nada osea ya no agrega despues del 13 o 17 y deja de ejecutar el while

		// en caso contrario que cree un paginador
		const boton=document.createElement("A");
		boton.href="#";
		boton.dataset.pagina=value;
		boton.textContent=value;
		boton.classList.add("siguiente", "rounded", "bg-yellow-400", "px-4", "py-2", "mr-2", "font-bold", "mb-4");
		boton.onclick=()=>{
			// console.log(value)
			paginaActual=value; //renombra el valor por cada valor al hacer click y llama otra vez a la api
			busqueda();
		}

		paginacion.appendChild(boton);
	}
}