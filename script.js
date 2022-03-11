// spawn n particles.
// each moving with their own velocities
// for each particle, check for particles which are below a distance of epsilon away.
    // draw a link between this particle and the other particle with intensity proportional to epsilon



    class Particle
    {
        constructor(posx, posy, velx, vely)
        {
            this.posx = posx;
            this.posy = posy;
            this.velx = velx;
            this.vely = vely;
        }
    }


    function RandomNumberNegativeBounds(lowerBound, upperBound)
    {
        return (Math.random()*(2*upperBound + 1)) - lowerBound 
    }
    
    function RandomNumber(lowerBound, upperBound)
    {
        return lowerBound + (Math.random()*upperBound); 
    }


    function DistanceSq(particle1, particle2)
    {
        return Math.pow(particle1.posx - particle2.posx, 2) + Math.pow(particle1.posy -particle2.posy, 2);
    }
    function Distance(particle1, particle2)
    {
        return Math.sqrt(DistanceSq(particle1, particle2));
    }

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');



    const maxX = window.innerWidth;
    const maxY = window.innerHeight;




    function GenerateParticle(posx, posy)
    {
        const maxVel = 1.5;
        return new Particle(posx, posy, RandomNumberNegativeBounds(-maxVel, maxVel), RandomNumberNegativeBounds(-maxVel, maxVel));

    }
    function GenerateParticles(numberofParticles)
    {

        let particles = [];
        for(let i = 0; i < numberofParticles; ++i)
        {
            particles.push(GenerateParticle(RandomNumber(0,maxX), RandomNumber(0,maxY)))
        }
        return particles;
    }



    particles = GenerateParticles(150);
    const particleRadius = 3;
    const particleDistanceThreshold = 140;
    const maxNeighbors = 4;

  
    function drawStuff() 
    {
        // do your drawing stuff here
        requestAnimationFrame(drawStuff)
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(particleIndex in particles)
        {
            particle = particles[particleIndex];
            particle.posx += particle.velx;
            particle.posy += particle.vely;


            if(particle.posx < 0) particle.posx = maxX;
            else if (particle.posx > maxX) particle.posx = 0;
            if(particle.posy < 0) particle.posy = maxY;
            else if(particle.posy > maxY) particle.posy = 0;
            
            const closestParticles = []
            const closestParticlesDistances = []

            for(otherParticleIndex in particles)
            {
                if(closestParticles.length >= maxNeighbors) break;
                if(particleIndex == otherParticleIndex) continue;
                var distSq = DistanceSq(particle, particles[otherParticleIndex])
                if(distSq < Math.pow(particleDistanceThreshold, 2))
                {
                    closestParticles.push(otherParticleIndex);
                    closestParticlesDistances.push(distSq);

                }

            }
          
            
            for(otherParticleIndex in closestParticles)
            {
                otherParticle = particles[closestParticles[otherParticleIndex]]
                let strokeOpacity = 1000/ closestParticlesDistances[otherParticleIndex];
                context.strokeStyle = 'rgba(0,0,0,' + strokeOpacity.toString() + ")";
                context.moveTo(particle.posx, particle.posy);
                context.lineTo(otherParticle.posx, otherParticle.posy);
                context.stroke();
            }

            context.fillStyle = "#FF0000";
            context.beginPath();
            context.arc(particle.posx, particle.posy, particleRadius, 0, 2 * Math.PI);
            context.fill();

        }

    }

    function resizeCanvas() 
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
                    
        drawStuff(); 
    }
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
        

    function spawnParticles(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        
        for(let i = 0; i < 5; ++i)
        {
            let randomIndex = RandomNumber(0, particles.length);
            particles.splice(randomIndex, 1);
            particle = GenerateParticle(x,y);
            particles.push(particle);
        }
  
    
    }
    
    canvas.addEventListener('mousedown', function(e) {
        spawnParticles(canvas, e)
    })

