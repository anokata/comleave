select oo.id, oo.name, 
coalesce((select sum(interval) as downwork
    from overwork_overs 
    where status='A' AND is_over='f' and person_id=oo.id ) , 0) as unwork, 
coalesce((select sum(interval) as upwork
    from overwork_overs join overwork_person on overwork_overs.person_id=overwork_person.id
    where status='A' AND is_over='t' and person_id=oo.id), 0) as overwork
from overwork_person as oo;


(select overwork_person.id as id, overwork_person.name, COALESCE(sum(interval), '0') as unwork
from overwork_overs 
inner join overwork_person on person_id=overwork_person.id 
where status='A' AND is_over='f' group by overwork_person.id
order by overwork_person.id);

(select overwork_person.id as id, overwork_person.name as name, sum(interval) as overwork
from overwork_overs 
inner join overwork_person on person_id=overwork_person.id 
where status='A' AND is_over='t' group by overwork_person.id
order by overwork_person.id); 

select sub1.id, sub1.name, sub2.id, sub2.name, overwork, unwork from 
        (select overwork_person.id as id, overwork_person.name, sum(interval) as unwork
        from overwork_overs 
        inner join overwork_person on person_id=overwork_person.id 
        where status='A' AND is_over='f' group by overwork_person.id
        order by overwork_person.id) as sub1,

        (select overwork_person.id as id, overwork_person.name as name, sum(interval) as overwork
        from overwork_overs 
        inner join overwork_person on person_id=overwork_person.id 
        where status='A' AND is_over='t' group by overwork_person.id
        order by overwork_person.id) as sub2;

(select overwork_person.id as id, overwork_person.name, sum(interval) as unwork, 'U' as tag
        from overwork_overs 
        inner join overwork_person on person_id=overwork_person.id 
        where status='A' AND is_over='f' group by overwork_person.id
        order by overwork_person.id) union

(select overwork_person.id as id, overwork_person.name as name, sum(interval) as overwork, 'D' as tag
        from overwork_overs 
        inner join overwork_person on person_id=overwork_person.id 
        where status='A' AND is_over='t' group by overwork_person.id
        order by overwork_person.id); 
