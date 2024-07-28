const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email }); //coloco o que foi achado na BD
        
        if(!this.user){ //caso nao exista esse usuario na BD
            this.errors.push('Usuário nao existe.');
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) { //comparo as hash que o bcrypt criptografou
            this.errors.push('Senha inválida');
            this.user = null; 
            return;
        }

    }

    async register() { //estamos envolvendo dentro de um método async pois estamos mexendo com BD neste momento.
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt); //criptografia da senha

        this.user = await LoginModel.create(this.body); //estou adicionando o email criado na chave users que antes era null
    }

    async userExists(){ //async pois vou mexer na BD   //  verifico se ja existe algum usuario com o mesmo email na BD
        this.user = await LoginModel.findOne({ email: this.body.email }); 
        if(this.user) this.errors.push('Usuário já existe.')
    }

    valida(){
        this.cleanUp();

        //Validação:
        //Email precisa ser valído e senha ter entre 3 e 50;

        if(!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido.');
        }

        if(this.body.password.length < 3 || this.body.password.length > 50){ 
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        }
    }

    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Login;
