//
//  COntentHome.swift
//  Trade Marketplace
//
//  Created by William larsen on 17/09/22.
//

import SwiftUI

struct ContentHome: View {
    var body: some View {
        VStack(spacing: 20){
            ContentHomeData(Title: "Suggested Jobs")
            ContentHomeData(Title: "Recently Viewed")
            ContentHomeData(Title: "Watchlist")
        }
    }
}
struct ContentHome_Previews: PreviewProvider {
    static var previews: some View {
        ContentHome()
    }
}


struct ContentHomeData: View {
    let columns = [GridItem(.fixed(165)), GridItem(.fixed(165))]
    @State var Title = String()
    var body: some View {
        VStack{
            HStack{
                Text(Title)
                    .font(.title)
                    .fontWeight(.semibold)
                    .foregroundColor(.black)
                    .frame(width: 250, height: 28, alignment: .leading)
                NavigationLink(destination: CategoryView(categoryname: Title, returnable: true)){
                    Text("see all")
                        .font(.subheadline)
                        .fontWeight(.light)
                        .foregroundColor(Color("ButtonColorSL"))
                        .frame(width: 71, height: 28, alignment: .bottomTrailing)
                }
            }
    ScrollView(.horizontal){
        LazyHGrid(rows: columns, spacing: 10) {
            ForEach(totaljobs){item in
                MainObject(title: .constant(item.title), subtitle: .constant(item.subtitle),
                           quotesent:.constant(item .quotesent),
                           location: .constant(item.location),
                           description: .constant(item.description),
                           image: .constant(item.images))}

        }.padding(.leading, 40)
        .padding(.bottom, 80)
    }
}
        

}
}
