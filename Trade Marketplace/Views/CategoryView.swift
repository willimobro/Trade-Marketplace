//
//  CategoryView.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct CategoryView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var downloadeddata: downloadcompletedlistingsdata
    @State var categoryname = ""
  
    @State var returnable = Bool()
    let columns = [GridItem(.fixed(165)), GridItem(.fixed(165))]
    
    var body: some View {
        NavigationView{
            ZStack {
                VStack{
                    CategoryNavigator(category: categoryname, leftbuttonenabled: returnable)
                    VStack{
                        SearchViaCategory()
                    }
                    ScrollView(.vertical){
//                        LazyVGrid(columns: columns, spacing: 10) {
                            List(downloadeddata.output, id: \.id) { item in
                                Text(item.title)
//                            }
                            
//                            ForEach(totaljobs){item in
//                                MainObject(title: .constant(item.title), subtitle: .constant(item.subtitle),
//                                           quotesent:.constant(item .quotesent),
//                                           location: .constant(item.location),
//                                           description: .constant(item.description),
//                                           image: .constant(item.images))}

                        }
                    }.overlay(
                        VStack{
                            Rectangle()
                                .frame(height:15)
                                .foregroundStyle(LinearGradient(
                                    gradient: Gradient(colors: [Color.white, Color.clear]),
                                    startPoint: .top,
                                    endPoint: .bottom))
                            Spacer()
                        }
                    )
                }.ignoresSafeArea()
                VStack{
                    Spacer()
                    FilterSort()
                }.ignoresSafeArea()
            }
                .navigationBarTitleDisplayMode(.inline)
                .navigationBarHidden(true)
            
        }.onAppear { self.downloadeddata.getData()
        }
    }
}

struct CategoryView_Previews: PreviewProvider {
    static var previews: some View {
        CategoryView()
    }
}
