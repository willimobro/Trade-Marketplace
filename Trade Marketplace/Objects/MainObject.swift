//
//  MainObject.swift
//  Trade Marketplace
//
//  Created by William larsen on 17/09/22.
//

//
//  Categorys.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct MainObject: View {
    @State  var title: String
    @State  var subtitle: String
    @State  var quotesent: Int
    @State  var location: String
    @State  var description: String
    @State var url: String
    var body: some View {
        NavigationLink(destination: ItemView(titleItem: title, subtitleItem: subtitle, quotesentItem: quotesent, locationItem: location, descriptionItem: description))  {
            AsyncImage(url: URL(string: url), scale: 0.1) { image in
                    image
                        .resizable()
                        .cornerRadius(11)
                        .frame(width: 159, height: 162)
                        .foregroundColor(.white)
                        .shadow(color:Color("dropshadow25"), radius: 12, x: 0, y: 6)
                } placeholder: {
                    Image(systemName: "rays")
                    .resizable()
                    .cornerRadius(11)
                    .frame(width: 159, height: 162)
                    .foregroundColor(.white)
                    .shadow(color:Color("dropshadow25"), radius: 12, x: 0, y: 6)
                }
                    .overlay(RoundedRectangle(cornerRadius: 11)
                        .fill(LinearGradient(gradient: Gradient(colors: [Color.clear, Color.black]),
                            startPoint: .top,
                                             endPoint: .bottom)).opacity(0.5))
                    .overlay(
                        VStack{
                            Text(title)
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .padding(15)
                        }.frame(width: 159, height: 162, alignment: .bottomLeading))
            
                
                    
                    
        }
    }
}

//struct MainObject_Previews: PreviewProvider {
//    static var previews: some View {
//        MainObject()
//    }
//}
