create table estoque(
	id int primary key auto_increment,
    nome_categoria varchar (50) not null,
    tipo varchar(100) not null ,
	quantidade int unsigned not null ,
    diametro double unsigned,
    metro int unsigned
);