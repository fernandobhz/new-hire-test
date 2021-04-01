export const mainCommandText = `
    select 
    a.id
    , a.name
    , a.spotifyId
    , (
        select 
        g.name

        from genres as g 

        join artists_genres as ag on ag.genreId = g.id
        and ag.artistId = a.id

        for json path
    ) as genres
    , (
        select 
        r.title
        , r.releaseDate as release_date
        , r.trackCount as track_count
        , r.upc
        , t.name as type
        , (
            select 
            ara.id

            from artists as ara

            join releases_artists as arra on arra.artistId = ara.id
            and arra.releaseId = r.id

            for json path
        ) as artists
        , (
            select
            arl.id
            , arl.distributor
            , arl.name
            , arl.region

            from labels as arl

            join releases as arr on arr.labelId = arl.id
            and arr.id = r.id

            for json path
        ) as label

        from releases as r

        join releases_artists as ra on ra.releaseId = r.id
        and ra.artistId = a.id

        join types as t on t.id = r.typeId

        where 1 = 1
        and (t.name = @typeName or @typeName is null)
        and (r.labelId = @labelId or @labelId is null)
        and (r.upc = @upc or @upc is null)

        for json path
    ) as releases

    from artists as a

    where a.id in (
    select
        a.id

    from artists as a		
    left join releases_artists as ra on ra.artistId = a.id 
    left join releases as r on ra.releaseId = r.id

    where 1 = 1
    and (a.id = @artistId or @artistId is null)
    and (a.name = @artistName or @artistName is null)
    and (r.typeId = (select id from types where name = @typeName) or @typeName is null)
    and (r.labelId = @labelId or @labelId is null)
    and (r.upc = @upc or @upc is null)
    )
`;
