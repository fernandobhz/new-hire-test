USE [master]
GO
CREATE DATABASE [media]
GO
USE [media]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[artists](
	[id] [int] NOT NULL,
	[name] [nvarchar](300) NOT NULL,
	[spotifyId] [varchar](40) NOT NULL,
 CONSTRAINT [PK_artists] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[artists_genres](
	[artistId] [int] NOT NULL,
	[genreId] [int] NOT NULL,
 CONSTRAINT [PK_artists_genres] PRIMARY KEY CLUSTERED 
(
	[artistId] ASC,
	[genreId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[genre](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](300) NOT NULL,
 CONSTRAINT [PK_genre] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[labels](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](300) NOT NULL,
	[distributor] [nvarchar](300) NULL,
	[region] [char](2) NOT NULL,
 CONSTRAINT [PK_labels] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[releases](
	[id] [int] NOT NULL,
	[title] [nvarchar](300) NOT NULL,
	[release-date] [date] NOT NULL,
	[track-count] [int] NULL,
	[upc] [varchar](50) NULL,
	[labelId] [int] NOT NULL,
	[typeId] [int] NOT NULL,
 CONSTRAINT [PK_releases] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[releases_artists](
	[releaseId] [int] NOT NULL,
	[artistId] [int] NOT NULL,
 CONSTRAINT [PK_releases_artists] PRIMARY KEY CLUSTERED 
(
	[releaseId] ASC,
	[artistId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[type](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](max) NOT NULL,
 CONSTRAINT [PK_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
CREATE NONCLUSTERED INDEX [IX_artists] ON [dbo].[artists]
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
CREATE NONCLUSTERED INDEX [IX_releases_first_identifier] ON [dbo].[releases]
(
	[upc] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
CREATE NONCLUSTERED INDEX [IX_releases_second_identifier] ON [dbo].[releases]
(
	[title] ASC,
	[release-date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[artists_genres]  WITH CHECK ADD  CONSTRAINT [FK_artists_genres_artists] FOREIGN KEY([artistId])
REFERENCES [dbo].[artists] ([id])
GO
ALTER TABLE [dbo].[artists_genres] CHECK CONSTRAINT [FK_artists_genres_artists]
GO
ALTER TABLE [dbo].[artists_genres]  WITH CHECK ADD  CONSTRAINT [FK_artists_genres_genre] FOREIGN KEY([genreId])
REFERENCES [dbo].[genre] ([id])
GO
ALTER TABLE [dbo].[artists_genres] CHECK CONSTRAINT [FK_artists_genres_genre]
GO
ALTER TABLE [dbo].[releases]  WITH CHECK ADD  CONSTRAINT [FK_releases_labels] FOREIGN KEY([labelId])
REFERENCES [dbo].[labels] ([id])
GO
ALTER TABLE [dbo].[releases] CHECK CONSTRAINT [FK_releases_labels]
GO
ALTER TABLE [dbo].[releases]  WITH CHECK ADD  CONSTRAINT [FK_releases_type] FOREIGN KEY([typeId])
REFERENCES [dbo].[type] ([id])
GO
ALTER TABLE [dbo].[releases] CHECK CONSTRAINT [FK_releases_type]
GO
ALTER TABLE [dbo].[releases_artists]  WITH CHECK ADD  CONSTRAINT [FK_releases_artists_artists] FOREIGN KEY([artistId])
REFERENCES [dbo].[artists] ([id])
GO
ALTER TABLE [dbo].[releases_artists] CHECK CONSTRAINT [FK_releases_artists_artists]
GO
ALTER TABLE [dbo].[releases_artists]  WITH CHECK ADD  CONSTRAINT [FK_releases_artists_releases] FOREIGN KEY([releaseId])
REFERENCES [dbo].[releases] ([id])
GO
ALTER TABLE [dbo].[releases_artists] CHECK CONSTRAINT [FK_releases_artists_releases]
GO
USE [master]
GO
ALTER DATABASE [media] SET  READ_WRITE 
GO
