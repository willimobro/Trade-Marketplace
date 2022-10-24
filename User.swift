//
//  User.swift
//  Trade Marketplace
//
//  Created by William larsen on 23/10/22.
//

import SwiftUI

struct Post: Identifiable {
    var title: String
    var content: String
    var authorName: String
    var timestamp = Date()
    var id = UUID()
    
}

extension Post{
    static let testPost = Post(
        title: "lol", content: "bruh", authorName: "meme")
    func contains(_ string: String) -> Bool {
        let properties = [title, content, authorName].map { $0.lowercased() }
        let query = string.lowercased()
     
        let matches = properties.filter { $0.contains(query) }
        return !matches.isEmpty
    }
}

struct PostsList: View {
    private var posts = [Post.testPost]
    @EnvironmentObject var downloadeddata: downloadcompletedlistingsdata
    @State private var searchText = ""
 
    var body: some View {
        NavigationView {
//            List(posts) { post in
//                if searchText.isEmpty || post.contains(searchText) {
//                    PostRow(post: post)
//                }
//            }
            ForEach(downloadeddata.output, id: \.id) { item in
                    Text(item.title)
                    
                }
            
            .searchable(text: $searchText)
            .navigationTitle("Posts")
        }
    }
}

struct PostRow: View {
    
    let post: Post
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(post.authorName)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Spacer()
                Text(post.timestamp.formatted(date: .abbreviated, time: .omitted))
                    .font(.caption)
            }
            .foregroundColor(.gray)
            Text(post.title)
                .font(.title3)
                .fontWeight(.semibold)
            Text(post.content)
        }
        .padding(.vertical)
    }
}


struct PostsList_Previews: PreviewProvider {
    static var previews: some View {
        PostsList()
    }
}
