//
//  CategoryView.swift
//  Trade Marketplace
//
//  Created by William larsen on 20/09/22.
//

import SwiftUI

struct CategoryView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var downloadeddata: downloadalljobs
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
                        LazyVGrid(columns: columns, spacing: 10) {
                            ForEach(downloadeddata.output, id: \.id) { item in
                                MainObject(title: item.title, subtitle: item.subtitle,
                                           quotesent:item .quotesent,
                                           location: item.location,
                                           description: item.description,
                                           url: item.url)}
                            
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
            
        
        }
        .onAppear {
            downloadeddata.getData()
        }
    }
}

struct CategoryView_Previews: PreviewProvider {
    static var previews: some View {
        CategoryView()
    }
}
