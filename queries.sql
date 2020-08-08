drop table if exists products;

create table products (
    code int primary key auto_increment,
    name varchar(50) not null,
    category varchar(50) not null,
    description varchar(50) not null,
    price int not null,
    quantity int not null 
);

insert into products values 
    (1000, 'IPhone', 'Electronics', 'Mobile Phones', 120000, 30),
    (1001, 'Mouse', 'Electronics', 'Computer accessories', 1000, 100),
    (1002, 'Ethanol IP', 'Medicine', 'Disinfectant', 200, 500);

drop procedure if exists productAddOrUpdate;

create DEFINER = `root`@`localhost` procedure productAddOrUpdate (
    in _code int,
    in _name varchar(50),
    in _category varchar(50),
    in _description varchar(50),
    in _price int,
    in _quantity int
)

BEGIN
    if _code = 0 then
        insert into products(name, category, description, price, quantity)
            values (_name, _category, _description, _price, _quantity);
        set _code = last_insert_id();
    else
        update products
            set 
                name = _name,
                category = _category,
                description = _description,
                price = _price,
                quantity = quantity - _quantity
            where code = _code;
    end if;
    select _code as 'code';
END