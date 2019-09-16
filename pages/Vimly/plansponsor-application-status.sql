
select o.owned_by_id                                        plansponsor_id,
       o.entity_id                                          application_id,
       c.id                                                 census_id,
       a.data ->> 'effectiveDateTime'                       effective_date_time,
       p.data -> 'externalIds' ->> 'clientId'               clientId,
       p.data -> 'externalIds' ->> 'legacyId'               legacyId,
       a.data -> 'companyProfile' ->> 'additionalCompanies' addtlComps,
       a.data ->> 'coverages'                               coverages,
       a.data                                               applicationJson,
       p.data                                               planSponsorJson
from entity.ownership o
         inner join entity.application a on a.id = o.entity_id
         inner join entity.plansponsor p on p.id = o.owned_by_id
         inner join entity.ownership co on co.owned_by_id = a.id
         right join entity.census c on co.entity_id = c.id
where o.entity_type = 'application'
  and o.owned_by_type = 'plansponsor'
  and p.data -> 'externalIds' ->> 'clientId' in ('177982') -- Search for PlanSponsors by clientId